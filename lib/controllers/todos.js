const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { Todo } = require('../models/Todo');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const todo = await Todo.insert({ ...req.body, userId: req.user.id });
      res.json(todo);
    } catch (error) {
      next(error);
    }
  });
