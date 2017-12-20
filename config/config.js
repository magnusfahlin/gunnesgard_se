let env = process.env.NODE_ENV || 'development'   // 1
 
if (env === 'development') {  // 2
  process.env.PORT = 3001
  process.env.MONGODB_URI = 'mongodb://localhost:27017/gunnesgard'
} else if (env === 'test') {  // 3
  process.env.PORT = 3001
  process.env.MONGODB_URI = 'mongodb://localhost:27017/gunnesgardtest'
}