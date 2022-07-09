const bcrypt = require('bcrypt');
const { User } = require('../models/User');

class UserService {
  static async create({ email, password }) {
    if (password.length <= 3) {
      throw new Error('Password must be at least 4 characters');
    }
    if (email.length <= 6) {
      throw new Error('Not a valid email');
    }

    const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    const user = await User.insert({ email, passwordHash });

    return user;
  }
}

module.exports = { UserService };
