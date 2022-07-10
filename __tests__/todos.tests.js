const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { UserService } = require('../lib/services/UserService');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const signUpAndIn = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('todos', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('POST /api/v1/todos should add a new todo for the authenticated user', async () => {
    const [agent, user] = await signUpAndIn();
    const newTodo = {
      description: 'finish assignments'
    };
    const res = await agent.post('/api/v1/todos').send(newTodo);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      description: 'finish assignments',
      complete: false,
      createdAt: expect.any(String),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
