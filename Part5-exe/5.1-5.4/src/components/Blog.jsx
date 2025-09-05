const Blog = ({ blog }) => {
  return (
    <div className="blog">
      {blog.title} by {blog.author}
    </div>
  )
}

export default Blog