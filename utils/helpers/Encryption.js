const bcrypt = require("bcrypt");

const Encrypt = {
  cryptPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },

  comparePassword: async (password, hashPassword) => {
    const match = await bcrypt.compare(password, hashPassword);
    return match;
  },
};

module.exports = Encrypt;
