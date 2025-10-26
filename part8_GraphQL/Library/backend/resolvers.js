const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

console.log('pubsub.asyncIterator type:', typeof pubsub.asyncIterableIterator)

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async ( root, args ) => {
        if (args.author && args.genre) {
            const author = await Author.findOne({ name: args.author })
            return Book.find({ author: author._id, genres: args.genre }).populate('author')
        }
        if (args.author) {
            const author = await Author.findOne({ name: args.author })
            return Book.find({ author: author._id }).populate('author')
        }
        if (args.genre) {
            return Book.find({ genres: args.genre }).populate('author')
        }
        return Book.find({}).populate('author')
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    allAuthors: async (root, args) => {
        return Author.find({}).populate('books')
    },
  },
   Author : {
    bookCount: async (root) => {
        return Book.countDocuments({ author: root._id })
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }


      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Creating the author failed ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        }
      }
      const book = new Book({
          title: args.title,
          author: author._id,
          published: args.published,
          genres: args.genres 
        })
      try {
        console.log(book)
        await book.save()
        author = await Author.findById(author._id)

        author.books = author.books.concat(book._id)
        await author.save()

        const populatedBook = await Book.findById(book._id).populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
        return populatedBook
        } catch (error) {
          throw new GraphQLError(`Creating the book failed ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
        })
      }
        
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save().catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
      
    
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOneAndUpdate({ name: args.name }, 
        { born: args.setBornTo }, { new: true })

      return author
        
    }

  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
  
}

module.exports = resolvers