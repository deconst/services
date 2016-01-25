function withoutTrailingSlash (original) {
  if (original[original.length - 1] === '/') {
    return original.substr(0, original.length - 1);
  } else {
    return original;
  }
}

exports.striderSystemEmail = process.env.STRIDER_SYSTEM_EMAIL;

exports.githubUsername = process.env.GITHUB_SYSTEM_USERNAME;
exports.githubToken = process.env.GITHUB_SYSTEM_TOKEN;
exports.githubAPIEndpoint = withoutTrailingSlash(process.env.GITHUB_API_ENDPOINT || 'https://api.github.com');
