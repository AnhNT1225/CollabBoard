require("dotenv").config();

exports.mailerConfig = JSON.parse(process.env.MAILER_CONFIG)

// module.exports = mailerConfig;