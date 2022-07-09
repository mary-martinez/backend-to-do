const pool = require('../utils/pool');

class User {
  id;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(`
    INSERT INTO userstodos
    (email, password_hash)
    VALUES ($1, $2)
    RETURNING *
    `, [email, passwordHash]);
    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(`
    SELECT * from userstodos
    WHERE email=$1
    `, [email]);
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
}

module.exports = { User };
