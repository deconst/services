var async = require('async');
var keypair = require('ssh-keypair');
var request = require('request');

var config = require('./config');
var user = require('./user');

var models = require('strider/lib/models');
var logger = require('strider/lib/logging');
var common = require('strider/lib/common');

var Project = models.Project;

exports.createControlProject = function (callback) {
  var m = /github\.com\/([^/.]+)\/([^/.]+)/.exec(config.controlRepositoryURL);
  if (!m) {
    logger.warn("The control repository %s does not appear to be on GitHub.", config.controlRepositoryURL);

    return callback(null);
  }

  var rawProjectName = decodeURIComponent(m[1]) + "/" + decodeURIComponent(m[2]);
  var projectName = rawProjectName.toLowerCase().replace(/ /g, '-');

  var systemUser = user.systemUser;
  var githubAccount = null;

  for (var i = 0; i < systemUser.accounts.length; i++) {
    if (systemUser.accounts[i].provider === 'github') {
      githubAccount = systemUser.accounts[i];
    }
  }

  if (!githubAccount) {
    return callback(new Error("System user is not connected to GitHub"));
  }

  var state = {
    githubProject: null,
    publicKey: null,
    privateKey: null
  };

  var discoverExistingProject = function (cb) {
    logger.debug("Checking for an existing Strider project named %s.", projectName);

    Project.findOne({ name: projectName }, function (err, p) {
      cb(err, !! p);
    });
  };

  var fetchGitHubRepository = function (cb) {
    logger.debug("Fetching the GitHub repository %s.", rawProjectName);

    request({
      url: config.githubAPIEndpoint + '/repos/' + rawProjectName,
      headers: {
        Authorization: 'token ' + config.githubToken,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'request strider-github-auth'
      },
      json: true
    }, function (err, resp, body) {
      if (err) return cb(err);

      if (resp.statusCode !== 200) {
        logger.error("Unsuccessful response from GitHub API: %s", resp.statusCode, body);

        return cb(new Error("Unable to retrieve repository information from GitHub"));
      }

      state.githubProject = body;

      cb(null);
    });
  };

  var generateKeyPair = function (cb) {
    logger.debug("Generating SSH keypair.");

    keypair(projectName + '-' + config.striderSystemEmail, function (err, priv, pub) {
      if (err) return cb(err);

      state.privateKey = priv;
      state.publicKey = pub;

      cb(null);
    });
  };

  var createProject = function (cb) {
    logger.debug("Creating a new Strider project %s.", projectName);

    var provider = {
      id: 'github',
      account: githubAccount.id,
      repo_id: state.githubProject.id,
      config: {
        auth: { type: 'https' },
        repo: state.githubProject.repo,
        owner: state.githubProject.owner.login,
        url: state.githubProject.clone_url
      }
    };

    var plugins = [
      {
        id: 'deconst-control',
        enabled: true,
        showStatus: true,
        config: {
          contentServiceURL: config.contentServiceURL,
          contentServiceAdminAPIKey: config.adminAPIKey,
          contentServiceTLSVerify: true,
          slackWebhookURL: config.slackWebhookURL,
          slackChannel: config.slackChannel,
          verbose: false
        }
      },
      {
        id: 'github-status',
        enabled: true,
        showStatus: true,
      }
    ];

    if (config.slackWebhookURL) {
      var slackPlugin = {
        id: 'slack',
        enabled: true,
        showStatus: true,
        config: {
          test_fail_message: ':exclamation: (<%= ref.branch %>) :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|Tests are failing><% if (trigger.url) { %> :: <<%= trigger.url %>|<%= trigger.message.trim() %>><% } %>',
          test_pass_message: ':white_check_mark: (<%= ref.branch %>) :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|Tests are passing><% if (trigger.url) { %> :: <<%= trigger.url %>|<%= trigger.message.trim() %>><% } %>',
          deploy_fail_message: ':boom: (<%= ref.branch %>) :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|Deploy exited with a non-zero status!><% if (trigger.url) { %> :: <<%= trigger.url %>|<%= trigger.message.trim() %>><% } %>',
          deploy_pass_message: ':ship: (<%= ref.branch %>) :: <<%= process.env.strider_server_name %>/<%= project.name %>/job/<%= _id %>|Deploy was successful><% if (trigger.url) { %> :: <<%= trigger.url %>|<%= trigger.message.trim() %>><% } %>',
          icon_url: (process.env.strider_server_name || 'http://localhost:3000') + '/ext/slack/bot_avatar',
          username: 'Deconst Strider',
          channel: toolbelt.config.slackChannel || '#deconst',
          webhookURL: toolbelt.config.slackWebhookURL
        }
      };
      plugins.push(slackPlugin);
    }

    var projectAttrs = {
      name: projectName,
      display_name: state.githubProject.name,
      display_url: state.githubProject.display_url,
      public: false,
      prefetch_config: false,
      creator: systemUser._id,
      provider: provider,
      branches: [
        {
          name: config.controlRepositoryBranch,
          active: true,
          mirror_master: false,
          deploy_on_green: true,
          pubkey: state.publicKey,
          privkey: state.privateKey,
          plugins: plugins,
          runner: { id: 'simple-runner', config: { pty: false } }
        }
      ]
    };

    logger.debug("Setting up GitHub provider plugin for %s.", projectName);

    var githubProviderPlugin = common.extensions.provider.github;
    githubProviderPlugin.setupRepo(githubAccount.config, provider.config, projectAttrs, function (err, config) {
      if (err) return cb(err);

      projectAttrs.provider.config = config;

      logger.debug("Creating Strider project for %s.", projectName);
      Project.create(projectAttrs, cb);
    });
  };

  discoverExistingProject(function (err, exists) {
    if (err) return callback(err);

    if (exists) {
      logger.info("Project %s already exists.", projectName);

      return callback(null);
    }

    async.series([
      discoverExistingProject,
      fetchGitHubRepository,
      generateKeyPair,
      createProject
    ], function (err) {
      if (err) {
        logger.error("Unable to create project %s.", projectName);
        return callback(err);
      }

      logger.info("Created control repository build project %s.", projectName);
      callback(null);
    });
  });
};
