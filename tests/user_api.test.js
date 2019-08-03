const mongoose = require('mongoose')
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = helper.initialUsers[0]
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'k',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Error, username is too short.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'kimmo',
      name: 'Superuser',
      password: 's',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Error, password is too short.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

describe('When there are multiple users and blogs at db', () => {

  beforeEach(async () => {
    
    await User.deleteMany({})
    await Blog.deleteMany({})
    
  })
  
  test('Login with correct password returns 200', async () => {

    const newUser = {
      username: 'Yomyssy',
      name: 'Kimmo Polojärvi',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
  })
  test('Login with incorrcet password returns 401', async () => {

    const newUser = {
      username: 'Yomyssy',
      name: 'Kimmo Polojärvi',
      password: 'spurdospärde',
    }

    const wrong = {
      username: 'Yomyssy',
      name: 'Kimmo Polojärvi',
      password: 'spörölöö',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    await api
      .post('/api/login')
      .send(wrong)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
  })

  test('login with correct password returns a token.', async () => {

    const newUser = {
      username: 'Yomyssy',
      name: 'Kimmo',
      password: 'salaisuus'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body.token.toLowerCase().startsWith('bearer '))
  })

  test('Can post a blog using correct token.', async () => {

    const newUser = {
      username: 'Yomyssy',
      name: 'Kimmo',
      password: 'salaisuus'
    }

    const forId = await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const id = forId.body.id
    console.log('id: '+id)
    
    const user = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = user.body.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    console.log('token: '+token)

    const testBlog =
    {
      title: 'soinin ploki',
      author: 'soini,',
      likes: 3,
      url: 'www.ploki.fi',
      user: id,
      authorization: 'bearer '+token
    }
    
    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })
})

afterAll(() => {
    mongoose.connection.close()
})