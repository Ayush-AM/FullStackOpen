const _ = require('lodash')

// 4.3: Dummy function
const dummy = (blogs) => {
  return 1
}

// 4.4: Total likes function
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// 4.5: Favorite blog function
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  
  const favorite = blogs.reduce((max, blog) => 
    blog.likes > max.likes ? blog : max, blogs[0]
  )
  
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

// 4.6: Most blogs function
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  
  const authorCounts = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(Object.keys(authorCounts), author => authorCounts[author])
  
  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}

// 4.7: Most likes function
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  
  const authorLikes = _.reduce(blogs, (result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + blog.likes
    return result
  }, {})
  
  const topAuthor = _.maxBy(Object.keys(authorLikes), author => authorLikes[author])
  
  return {
    author: topAuthor,
    likes: authorLikes[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}