import express from 'express'
import { protect, admin } from '../middleware/auth.middleware.js'
import { upload, uploadImage, getImage, listImages } from '../controllers/image.controller.js'

const router = express.Router()

// Get all images (for media manager)
router.get('/', listImages)

// Upload image (temporarily open for testing, add protect + admin in production)
router.post('/', upload.single('image'), uploadImage)

// Stream image by id
router.get('/:id', getImage)

export default router
