const errorResponse = (message) => {
  return { success: false, message, timestamp: Date.now() };
};

module.exports = errorResponse;
