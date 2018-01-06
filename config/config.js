require('dotenv').config()

let env = process.env.NODE_ENV || 'development'

if (!process.env.POSTS_SHOWN_NOT_LOGGED_IN)
 {
  process.env.POSTS_SHOWN_NOT_LOGGED_IN = 5;
 }

if (env === 'development') {
  process.env.SECRET = "secret"
  process.env.PORT = 3001
  process.env.MONGODB_URI = 'mongodb://localhost:27017/gunnesgard'
  process.env.POSTS_SHOWN_NOT_LOGGED_IN = 5;

  console.log("env is set to development!")
} else if (env === 'test') {
  process.env.SECRET = "secret"
  process.env.PORT = 3001
  process.env.MONGODB_URI = 'mongodb://localhost:27017/gunnesgardtest' 

  console.log("env is set to test!")
}

