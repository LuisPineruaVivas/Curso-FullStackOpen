const dummy = (blogs) => {
    blogs = 1
    return blogs
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const favoriteBlog = blogs.find(blog => blog.likes === maxLikes)
    return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes
    }
}

const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author)
    const authorCounts = authors.reduce((counts, author) => {
        counts[author] = (counts[author] || 0) + 1
        return counts
    }, {})
    const maxBlogs = Math.max(...Object.values(authorCounts))
    const authorWithMostBlogs = Object.keys(authorCounts).find(author => authorCounts[author] === maxBlogs)
    return {
        author: authorWithMostBlogs,
        blogs: maxBlogs
    }
}

const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((likes, blog) => {
        likes[blog.author] = (likes[blog.author] || 0) + blog.likes
        return likes
    }, {})
    const maxLikes = Math.max(...Object.values(authorLikes))
    const authorWithMostLikes = Object.keys(authorLikes).find(author => authorLikes[author] === maxLikes)
    return {
        author: authorWithMostLikes,
        likes: maxLikes
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}