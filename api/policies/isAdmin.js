/**
 * This policy is to be called after calling isLoggedIn policy, ie.
 * after validating that the auth token exits and it is valid.
 * In this policy, it checks if the token is matching with the user's token stored in the database
 */
module.exports = async (req, res, next) => {
  try {
    // get the decoded token from request, assuming that it is set by the previous policy
    if (!req.decodedToken) {
      return res.forbidden();
    }

    // assuming that the headers and token are checked in the previous policy.
    const token = req.headers["authorization"].split(" ")[1];
    const admin = await Admin.findOne({
      id: req.decodedToken.id,
      isActive: true,
    });
    // if there is no user with given id OR the token is not matching with the one stored in the database
    if (!admin || admin.token !== token) {
      return res.forbidden();
    } else {
      req.me = admin;
      return next();
    }
  } catch (error) {
    sails.log.error(error);
    return res.forbidden();
  }
};
