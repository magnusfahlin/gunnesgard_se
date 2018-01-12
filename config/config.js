require('dotenv').config()

let env = process.env.NODE_ENV || 'development'

process.env.POSTS_SHOWN_NOT_LOGGED_IN = process.env.POSTS_SHOWN_NOT_LOGGED_IN ? process.env.POSTS_SHOWN_NOT_LOGGED_IN : 5;
process.env.JWT_EXPIRE_TIME_SECONDS = process.env.JWT_EXPIRE_TIME_SECONDS ? process.env.JWT_EXPIRE_TIME_SECONDS : 60 * 60 * 12;

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

