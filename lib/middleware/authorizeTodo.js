const { Todo } = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const todo = await Todo.getById(req.params.id);

    if (!todo || todo.userId !== req.user.id) {
      throw new Error('No permission to access this todo item');
    }
    next();
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
