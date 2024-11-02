const successResponse = (message, data) => {
  return { success: true, message, data, timestamp: Date.now() };
};

module.exports = successResponse;
