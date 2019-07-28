const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'soinin ploki',
        author: 'soini,',
        likes: 3,
        url: 'www.ploki.fi'
    },
    {
        title: 'väyskän bloki',
        author: 'väyrynen',
        likes: 2,
        url: 'www.bloki.fi'
    },
    {
        title: 'ploki ilman tykkäyksiä',
        author: 'seppo',
        url: 'www.seponbloki.fi',
    },
  ]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}