import mongoose from 'mongoose'

let gridFSBucket = null
let cachedConnection = null

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://connectishori_db_user:Yh3ePENcOq9nzlBk@cluster0.z1a5fge.mongodb.net/'
    if (!process.env.MONGODB_URI) {
      console.warn('ℹ️  MONGODB_URI not set. Falling back to mongodb+srv://connectishori_db_user:Yh3ePENcOq9nzlBk@cluster0.z1a5fge.mongodb.net/')
    }

    const conn = await mongoose.connect(uri)
    cachedConnection = conn.connection
    // Initialize GridFS bucket once the DB is ready
    gridFSBucket = new mongoose.mongo.GridFSBucket(cachedConnection.db, {
      bucketName: 'uploads'
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`)
  } catch (error) {
    console.error('❌ Error connecting to MongoDB: ' + error.message)
    console.error('   Tips: Ensure MongoDB is running locally or set MONGODB_URI in backend/.env')
    process.exit(1)
  }
}

export default connectDB

export const getGridFSBucket = () => {
  if (!gridFSBucket) {
    throw new Error('GridFSBucket not initialized yet')
  }
  return gridFSBucket
}

export const getDbConnection = () => cachedConnection
