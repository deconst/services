function withoutTrailingSlash (original) {
  if (original[original.length - 1] === '/') {
    return original.substr(0, original.length - 1);
  } else {
    return original;
  }
}

exports.striderSystemEmail = process.env.STRIDER_SYSTEM_EMAIL;

exports.githubToken = process.env.GITHUB_SYSTEM_TOKEN;
exports.githubAPIEndpoint = withoutTrailingSlash(process.env.GITHUB_API_ENDPOINT || 'https://api.github.com');

exports.contentServiceURL = process.env.CONTENT_SERVICE_URL;
exports.adminAPIKey = process.env.ADMIN_API_KEY;

exports.stagingPresenterURL = process.env.STAGING_PRESENTER_URL;
exports.stagingContentServiceURL = process.env.STAGING_CONTENT_SERVICE_URL;
exports.stagingContentServiceAdminAPIKey = process.env.STAGING_ADMIN_API_KEY;

exports.controlRepositoryURL = process.env.CONTROL_REPO_URL;
exports.controlRepositoryBranch = process.env.CONTROL_REPO_BRANCH || 'master';
exports.slackWebhookURL = process.env.SLACK_WEBHOOK_URL;
exports.slackChannel = process.env.SLACK_CHANNEL;
