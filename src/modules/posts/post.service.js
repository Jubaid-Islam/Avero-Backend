import Post from './post.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.helper.js';


const createPostService = async (user, text, file) => {

    if (!text && !file) {
        throw new Error('post must contain either text or an image');
    }

    let imageUrl = '';
    let publicId = '';

    // upload image into cloudinary
    if (file) {
        const uploadResult = await uploadToCloudinary(file.buffer, 'social_image');
        imageUrl = uploadResult.imageUrl;
        publicId = uploadResult.publicId;
    }

    // then create a post
    return await Post.create({
        userId: user.id,
        username: user.username,
        text: text || '',
        imageUrl,
        publicId,
    });

}



// get post by descending
const getPostsService = async (cursor = null, limit) => {
    const query = cursor ? {
        _id: { $lt: cursor } // old post
    } : {};

    const posts = await Post.find(query)
        .sort({ _id: -1 })   // old to new
        .limit(limit + 1);

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();  // remove the 11th post

    const nextCursor = posts.length > 0
        ? posts[posts.length - 1]._id
        : null;

    return {
        posts,
        nextCursor,
        hasMore,
    };

}



// get single post
const getPostByIdService = async (postId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error('post not found');
    }
    return post;
};



// like status for user
const toggleLikeService = async (postId, user) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('post not found');
    }

    const alreadyLikedIndex = post.likes.findIndex((like) =>
        like.userId.equals(user.id)  // if false then findindex = -1
    );

    let isLiked = false;

    // if true then remove like from the post.likes array
    if (alreadyLikedIndex > -1) {
        post.likes.splice(alreadyLikedIndex, 1);

    }
    else {
        post.likes.push({
            userId: user.id,
            username: user.username
        });
        isLiked = true;
    }

    post.likesCount = post.likes.length;
    await post.save();

    return { likesCount: post.likesCount, isLiked };
}



// add comment to the target post
const addCommentService = async (postId, user, text) => {

    if (!text || !text.trim()) {
        throw new Error('comment text is required');
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('post not found');
    }

    // add comment into db
    post.comments.push({
        userId: user.id,
        username: user.username,
        text: text.trim(),
        createdAt: new Date(),
    });

    post.commentsCount = post.comments.length;
    await post.save();

    return post;

}



// delete post and file
const deletePostService = async (postId, userId) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('post not found');
    }

    // verify user before deletion
    if (!post.userId.equals(userId)) {
        throw new Error('unauthorized to delete this post');
    }

    // delete file from cloudinary
    if (post.publicId) {
        await deleteFromCloudinary(post.publicId);
    }

    await post.deleteOne();
    return true;

}


export {
    createPostService,
    getPostsService,
    getPostByIdService,
    toggleLikeService,
    addCommentService,
    deletePostService,
};