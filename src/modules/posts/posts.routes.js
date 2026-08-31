import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import upload from '../../middleware/upload.middleware.js';

import {
    createPost,
    getPosts,
    getPostById,
    toggleLike,
    addComment,
    deletePost,
} from './posts.controller.js';

const router = express.Router();



// public routes
router.get('/', getPosts);
router.get('/:id', getPostById);


// private routes
router.post('/', authMiddleware, upload.single('image'), createPost);
router.post('/:id/like', authMiddleware, toggleLike);
router.post('/:id/comment', authMiddleware, addComment);

router.delete('/:id', authMiddleware, deletePost);


export default router;