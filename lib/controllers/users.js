const { Router } = require('express');
const { UserService } = require('../services/UserService');

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signIn(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS
        })
        .json({ message: 'Successfully signed in!' });

    } catch (e) {
      next(e);
    }
  });
