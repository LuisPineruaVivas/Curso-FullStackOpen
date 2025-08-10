import { useState } from "react"
import PropTypes from "prop-types"

const Blog = ({ blog, onLike, onRemove, user }) => {
  const [visibleDetails, setVisibleDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onRemove(blog.id);
    }
  }

  return(
    <div>
      {
        !visibleDetails ?
        <div style={blogStyle}>
          <div className="title">Title: {blog.title} | Author: {blog.author}</div> <button onClick={() => setVisibleDetails(!visibleDetails)}> {visibleDetails ? 'hide' : 'View Details'} </button>
        </div> :
        <div style={blogStyle}>
          <div className="title">Title: {blog.title} | Author: {blog.author} <button onClick={() => setVisibleDetails(!visibleDetails)}> {visibleDetails ? 'hide' : 'View Details'} </button></div> 
          <div className="url">{blog.url}</div>
          <div className="likes">likes: <span data-testid="likes">{blog.likes}</span> <button onClick={() => {onLike(blog.id)}}>like</button></div>
          <div className="user">Added by {blog.user.name}</div>
          {
            blog.user.id === user.id ?
            <button onClick={handleDelete}>Remove</button> :
            <div></div>
          }
        </div>


      }
    </div>  
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog