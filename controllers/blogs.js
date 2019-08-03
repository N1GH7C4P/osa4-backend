const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
// ...
const getTokenFrom = request => {
  const authorization = request.get('authorization')  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs.map(b => b.toJSON()))
});

blogsRouter.post('/', async (request, response, next) => {
  
  const body = request.body
  const token = getTokenFrom(request)    
  try   {    
    const decodedToken = jwt.verify(token, process.env.SECRET)    
      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title:body.title,
      author:body.author,
      url:body.url,
      likes:body.likes === undefined ? 0 : body.likes,
      user: user
    })  

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedblog._id)    
      await user.save()
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

blogsRouter.put('/:id', async (request, response, next) => {
  
  const blog = {
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes
  }

  try{
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedblog => {
      response.json(updatedblog.toJSON())
    })
    .catch(error => next(error))
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter