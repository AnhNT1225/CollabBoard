const crypto = require("crypto");
const genRandomCode = () => {
  const randomCode = crypto.randomBytes(5).toString("hex");
  console.log("randomCode: ", randomCode);
  return randomCode;
};

module.exports ={genRandomCode: genRandomCode}