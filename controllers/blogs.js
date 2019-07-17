const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const generateId = () => {
  const max = 1000000;
  const randomId = Math.floor(Math.random() * Math.floor(max));
  console.log("ID generated:"+randomID)
  return randomId
}

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs.map(blog => blog.toJSON()))
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body
  const blog = new Blog({

    id:generateId,
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes
    
  })

  blog.save()
    .then(savedblog => {
      response.json(savedblog.toJSON())
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
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