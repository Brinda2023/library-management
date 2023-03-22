module.exports = function badRequest(msgKey, customMsg = undefined) {
  // Get access to `req` and `res`
  const req = this.req;
  const res = this.res;

  // Define the status code to send in the response.
  const statusCodeToSet = 400;
  // sails.log.info(msgKey, customMsg);
  // If there is any custom message, then return that, otherwise get the message using the key
  const errorMsg = customMsg
    ? customMsg
    : sails.config.utils.getMessage(msgKey, req.getLocale());
  const responseToSend = {
    status: statusCodeToSet,
    data: {},
    error: errorMsg,
  };

  // Set status code and send response data.
  return res.status(statusCodeToSet).send(responseToSend);
};
