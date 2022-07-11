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

  static async getAll(userId) {
    const { rows } = await pool.query(`
    SELECT * FROM todos
    WHERE user_id=$1
    `, [userId]);
    return new Todo(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(`
    SELECT * FROM todos
    WHERE id=$1
    `, [id]);
    if (!rows[0]) return null;
    return new Todo(rows[0]);
  }

  static async updateById(id, attrs) {
    const todo = await this.getById(id);
    if (!todo) return null;
    const { description, complete } = { ...todo, ...attrs };
    console.log('complete', complete);
    const { rows } = await pool.query(`
    UPDATE todos
    SET description=$2, complete=$3
    WHERE id=$1
    RETURNING *
    `, [id, description, complete]);
    return new Todo(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(`
    DELETE FROM todos
    WHERE id=$1
    RETURNING *
    `, [id]);
    return new Todo(rows[0]);
  }
}

module.exports = { Todo };
