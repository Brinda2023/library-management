module.exports = function ok(optionalData) {
  // Get access to `req` and `res`
  const res = this.res;

  // Define the status code to send in the response.
  const statusCodeToSet = 200;
  const responseToSend = {
    status: statusCodeToSet,
    data: optionalData ? optionalData : {},
    error: "",
  };

  return res.status(statusCodeToSet).json(responseToSend);
};
