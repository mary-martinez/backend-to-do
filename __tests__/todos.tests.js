const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { UserService } = require('../lib/services/UserService');
const { Todo } = require('../lib/models/Todo');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const mockUser2 = {
  email: 'unrea@aol.com',
  password: 'apples'
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
  it('GET /api/v1/todos should return a list of todos for the authenticated user', async () => {
    const [agent, user] = await signUpAndIn();
    const user2 = await UserService.create(mockUser2);
    const userTodo = await Todo.insert({
      description: 'Take a nap',
      userId: user.id
    });
    await Todo.insert({
      description: 'Get groceries',
      userId: user2.id
    });
    const res = await agent.get('/api/v1/todos');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      ...userTodo,
      id: expect.any(String),
      complete: false,
      createdAt: expect.any(String)
    });
  });
  it('GET /api/v1/todos should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/todos');
    expect(res.status).toEqual(401);
  });

  it('PUT /api/v1/todos/1 should update a todo for the authenticated and authorized user', async () => {
    const [agent, user] = await signUpAndIn();
    const todo = await Todo.insert({
      description: 'Take a nap',
      userId: user.id
    });
    const res = await agent
      .put(`/api/v1/todos/${todo.id}`)
      .send({ complete: true });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ ...todo, complete: true, createdAt: expect.any(String) });
  });
  afterAll(() => {
    pool.end();
  });
});
