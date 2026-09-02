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
    getPostLikes,
} from './posts.controller.js';

const router = express.Router();



// public routes
router.get('/', getPosts);


// private routes
router.get('/:id', authMiddleware, getPostById);
router.get('/:id/likes', authMiddleware, getPostLikes);
router.post('/', authMiddleware, upload.single('image'), createPost);
router.post('/:id/like', authMiddleware, toggleLike);
router.post('/:id/comment', authMiddleware, addComment);

router.delete('/:id', authMiddleware, deletePost);


export default router;