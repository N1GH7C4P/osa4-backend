const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body.length).toBe(helper.initialBlogs.length)
})
  
test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)
    expect(title).toContain('soinin ploki')
})

test('returned blogs have defined id fields', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body.map(r => r.id)
    expect(id).toBeDefined()
})

test('if there are no likes defined, 0 is added.', async () => {
    const response = await api.get('/api/blogs')
    const likes = response.body.map(r => r.likes)
    expect(likes).toBeDefined()
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'niinistön blogi',
        author: 'sale',
        likes: '5',
        url: 'www.blogi.fi'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()  
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
    const title = blogsAtEnd.map(n => n.title)  
    expect(title).toContain(
        'niinistön blogi'
    )
})

test('blog without title or author gets status 400 bad request', async () => {
    const newBlog = {
        likes: '5',
        url: 'www.blogi.fi'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
})


test('blog without title is not added', async () => {
    const newBlog = {
        author: 'paavo'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api    
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(resultBlog.body).toEqual(blogToView)
  })
  
test('a blog can be deleted', async () => {
const blogsAtStart = await helper.blogsInDb()
const blogToDelete = blogsAtStart[0]

await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
const blogsAtEnd = await helper.blogsInDb()

expect(blogsAtEnd.length).toBe(
    helper.initialBlogs.length - 1
)

const title = blogsAtEnd.map(r => r.title)

expect(title).not.toContain(blogToDelete.title)
})