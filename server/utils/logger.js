function log(level, message, metadata = {}) {
  const safeMetadata = { ...metadata };
  delete safeMetadata.apiKey;
  delete safeMetadata.token;
  delete safeMetadata.password;
  console[level](`[${new Date().toISOString()}] ${message}`, safeMetadata);
}
module.exports = { info: (message, metadata) => log('log', message, metadata), error: (message, metadata) => log('error', message, metadata) };
