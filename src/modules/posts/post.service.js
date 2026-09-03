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
        email: user.email,
        text: text || '',
        imageUrl,
        publicId,
    });

}


// get posts by descending
const getPostsService = async (cursor = null, limit, currentUserId) => {
    const query = cursor ? {
        _id: { $lt: cursor } // old post
    } : {};

    const posts = await Post.find(query)
        .sort({ _id: -1 })   // new to old
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
const getPostByIdService = async (postId, userId) => {
    const post = await Post.findById(postId).lean();

    if (!post) {
        throw new Error('Post not found');
    }

    const isLiked = post.likes.some(
        (like) => like.userId.toString() === userId.toString()
    );
    const isOwner = post.userId.toString() === userId.toString();

    return {
        ...post,
        isLiked,
        isOwner,
        likesCount: post.likesCount,
    };
};



// like status for user 
const toggleLikeService = async (postId, user) => {

    // unlike user function
    const unlikedPost = await Post.findOneAndUpdate(
        {
            _id: postId,
            'likes.userId': user.id
        },

        {
            $pull: { likes: { userId: user.id } },
            $inc: { likesCount: -1 }
        },

        { new: true }
    );

   
    if (unlikedPost) {      // if user exist then unlike
        return {
            isLiked: false,
            likesCount: unlikedPost.likesCount,
        };
    }


    // if user not exist then like
    const likedPost = await Post.findOneAndUpdate(
        {
            _id: postId,
            'likes.userId': { $ne: user.id }
        },

        {
            $addToSet: { likes: { userId: user.id, username: user.username } },
            $inc: { likesCount: 1 }
        },

        { new: true }
    );

    
    if (!likedPost) {
        throw new Error('Post not found');
    }

    return {
        isLiked: true,
        likesCount: likedPost.likesCount,
    };
};


const getPostLikesService = async (postId) => {
    const post = await Post.findById(postId).select('likes likesCount');

    if (!post) {
        throw new Error('post not found');
    }

    return {
        likes: post.likes,
        likesCount: post.likesCount,
    };
};


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

    return {
        commentsCount: post.commentsCount,
        comments: post.comments
    };

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
    getPostLikesService,
    addCommentService,
    deletePostService,
};