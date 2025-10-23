import express from 'express'
import { protect, admin } from '../middleware/auth.middleware.js'
import { upload, uploadVideo, getVideo, listVideos } from '../controllers/image.controller.js'

const router = express.Router()

// Get all videos (for media manager)
router.get('/', listVideos)

// Upload video (temporarily open for testing, add protect + admin in production)
router.post('/', upload.single('video'), uploadVideo)

// Stream video by id (public, supports range requests)
router.get('/:id', getVideo)

export default router
