const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const generateId = () => {
  const max = 1000000;
  const randomId = Math.floor(Math.random() * Math.floor(max));
  console.log("ID generated:"+randomID)
  return randomId
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
  })

blogsRouter.get('/:id', async (request, response, next) => {
  try{
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const blog = new Blog({
    id:generateId,
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes === undefined ? 0 : body.likes
  })
  try {
      const savedBlog = await blog.save()
      response.json(savedBlog.toJSON())
  } catch(exception){    
      next(exception)  
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedblog => {
      response.json(updatedblog.toJSON())
    })
    .catch(error => next(error))
})

module.exports = blogsRouter