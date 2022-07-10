const pool = require('../utils/pool');

class Todo {
  id;
  userId;
  description;
  complete;
  createdAt;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.description = row.description;
    this.complete = row.complete;
    this.createdAt = row.created_at;
  }

  static async insert({ description, userId }) {
    const { rows } = await pool.query(`
      INSERT INTO todos
      (description, user_id)
      VALUES ($1, $2)
      RETURNING *
    `, [description, userId]);
    return new Todo(rows[0]);
  }
}

module.exports = { Todo };
