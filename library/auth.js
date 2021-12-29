const bcrypt = require("bcryptjs");

// password encryption
const pwdEncrypt = async (value) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  } catch (err) {
    console.log("bcrypt hashing error", err);
  }
};

// password comparison
const pwdCompare = async (currentPWD, hashedPWD) => {
  try {
    const compare = await bcrypt.compare(currentPWD, hashedPWD);
    return compare;
  } catch (err) {
    console.log("Password Comparison error", err);
  }
};

module.exports = { pwdEncrypt, pwdCompare };
