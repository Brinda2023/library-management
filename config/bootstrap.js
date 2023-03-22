/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  // Check if the admin user with given email exists in the database or not. Create admin user if not already exists
  sails.log.info(
    `Creating admin user with email ${process.env.ADMIN_EMAIL} and password ${process.env.ADMIN_PASSWORD}`
  );
  const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!admin) {
    await Admin.create({
      id: sails.config.constants.uuid(),
      firstName: "Super",
      lastName: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: await sails.helpers.password.encrypt(
        process.env.ADMIN_PASSWORD
      ),
      isActive: true,
    });
  }
};
