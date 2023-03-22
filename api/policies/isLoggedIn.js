/**
 * This policy checks if the request header has valid authentication token or not.
 * Assumes Bearer based authentication token
 */
module.exports = async (req, res, next) => {
  try {
    // sails.log.info('isLoggedIn called');
    // get the request authorisation header
    const header = req.headers["authorization"];
    // sails.log.info(header);
    if (!header) {
      return res.forbidden();
    }
    // get the authentication token assuming Bearer token
    const token = header.split(" ")[1];
    // sails.log.info(token);
    if (!token) {
      return res.forbidden();
    }

    // verify the token and get the decoded token
    const decodedToken = await sails.helpers.jwt.verify(token);

    // if there is no decodedToken returned, ie invalid or expired token was passed
    if (!decodedToken) {
      return res.forbidden();
    }

    req.decodedToken = decodedToken;

    return next();
  } catch (error) {
    sails.log.error(error);
    return res.forbidden();
  }
};
