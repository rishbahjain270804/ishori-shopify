import multer from 'multer'
import { getGridFSBucket } from '../config/database.js'
import crypto from 'crypto'

const storage = multer.memoryStorage()
export const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB for videos
})

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })

    const bucket = getGridFSBucket()
    const filename = req.body.filename || `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${req.file.originalname}`

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
        size: req.file.size,
        uploadedBy: req.user?._id || null,
        type: 'image'
      }
    })

    uploadStream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Upload error', error: err.message })
      }
    })

    uploadStream.on('finish', () => {
      try {
        const fileId = uploadStream.id?.toString()
        const fname = uploadStream.filename
        if (!fileId) {
          return res.status(500).json({ success: false, message: 'Upload finished but no file id returned' })
        }
        res.status(201).json({ success: true, fileId, filename: fname, url: `/api/images/${fileId}` })
      } catch (err) {
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Upload finalize error', error: err.message })
        }
      }
    })

    uploadStream.end(req.file.buffer)
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error uploading image', error: e.message })
  }
}

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })

    const bucket = getGridFSBucket()
    const filename = req.body.filename || `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${req.file.originalname}`

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
        size: req.file.size,
        uploadedBy: req.user?._id || null,
        type: 'video'
      }
    })

    uploadStream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Upload error', error: err.message })
      }
    })

    uploadStream.on('finish', () => {
      try {
        const fileId = uploadStream.id?.toString()
        const fname = uploadStream.filename
        if (!fileId) {
          return res.status(500).json({ success: false, message: 'Upload finished but no file id returned' })
        }
        res.status(201).json({ success: true, fileId, filename: fname, url: `/api/videos/${fileId}` })
      } catch (err) {
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Upload finalize error', error: err.message })
        }
      }
    })

    uploadStream.end(req.file.buffer)
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error uploading video', error: e.message })
  }
}

export const getVideo = async (req, res) => {
  try {
    const bucket = getGridFSBucket()
    const { id } = req.params
    let _id
    try {
      _id = new (await import('mongodb')).ObjectId(id)
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid video id' })
    }

    const files = await bucket.find({ _id }).toArray()
    if (!files?.length) return res.status(404).json({ success: false, message: 'Video not found' })
    const file = files[0]
    
    // Support range requests for video streaming
    const range = req.headers.range
    const fileSize = file.length
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = (end - start) + 1
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': file.contentType || 'video/mp4',
      })
      
      const readStream = bucket.openDownloadStream(_id, { start, end: end + 1 })
      readStream.pipe(res)
    } else {
      res.set('Content-Type', file.contentType || 'video/mp4')
      res.set('Content-Length', fileSize)
      const readStream = bucket.openDownloadStream(_id)
      readStream.on('error', () => res.sendStatus(500))
      readStream.pipe(res)
    }
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching video', error: e.message })
  }
}

export const getImage = async (req, res) => {
  try {
    const bucket = getGridFSBucket()
    const { id } = req.params
    let _id
    try {
      _id = new (await import('mongodb')).ObjectId(id)
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid image id' })
    }

    const files = await bucket.find({ _id }).toArray()
    if (!files?.length) return res.status(404).json({ success: false, message: 'Image not found' })
    const file = files[0]
    res.set('Content-Type', file.contentType || 'application/octet-stream')

    const readStream = bucket.openDownloadStream(_id)
    readStream.on('error', () => res.sendStatus(500))
    readStream.pipe(res)
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching image', error: e.message })
  }
}

// @desc    List all images
// @route   GET /api/images
// @access  Public
export const listImages = async (req, res) => {
  try {
    const bucket = getGridFSBucket()
    const files = await bucket.find({ 'metadata.type': 'image' }).sort({ uploadDate: -1 }).toArray()
    
    const images = files.map(file => ({
      _id: file._id.toString(),
      fileId: file._id.toString(),
      filename: file.filename,
      contentType: file.contentType,
      size: file.length,
      uploadDate: file.uploadDate,
      url: `/api/images/${file._id.toString()}`,
      metadata: file.metadata
    }))

    res.status(200).json({
      success: true,
      data: images,
      count: images.length
    })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error listing images', error: e.message })
  }
}

// @desc    List all videos
// @route   GET /api/videos
// @access  Public
export const listVideos = async (req, res) => {
  try {
    const bucket = getGridFSBucket()
    const files = await bucket.find({ 'metadata.type': 'video' }).sort({ uploadDate: -1 }).toArray()
    
    const videos = files.map(file => ({
      _id: file._id.toString(),
      fileId: file._id.toString(),
      filename: file.filename,
      contentType: file.contentType,
      size: file.length,
      uploadDate: file.uploadDate,
      url: `/api/videos/${file._id.toString()}`,
      metadata: file.metadata
    }))

    res.status(200).json({
      success: true,
      data: videos,
      count: videos.length
    })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error listing videos', error: e.message })
  }
}
