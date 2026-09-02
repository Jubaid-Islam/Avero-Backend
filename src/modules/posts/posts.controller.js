import {
  createPostService,
  getPostsService,
  getPostByIdService,
  toggleLikeService,
  addCommentService,
  deletePostService,
  getPostLikesService,
} from './post.service.js';



// handle new post
const createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.user, req.body.content, req.file);
    res.status(201).json(post);

  } catch (error) {
    next(error);
  }

};



// get paginated feed
const getPosts = async (req, res, next) => {
  try {
    const cursor = req.query.cursor || null;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await getPostsService(cursor, limit, req.user?.id);

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }

};



// get post details by post id
const getPostById = async (req, res, next) => {
  try {
    const post = await getPostByIdService(
      req.params.id,
      req.user.id
    );

    res.status(200).json(post);
  } catch (error) {
    if (error.message === 'Post not found') {
      return res.status(404).json({
        message: error.message,
      });
    }

    next(error);
  }
};



// toggles like status on post
const toggleLike = async (req, res, next) => {
  try {
    const result = await toggleLikeService(req.params.id, req.user);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};

const getPostLikes = async (req, res) => {
  try {
    const result = await getPostLikesService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// handles adding a comment to a post
const addComment = async (req, res, next) => {
  try {
    const post = await addCommentService(req.params.id, req.user, req.body.text);
    res.status(200).json(post);

  } catch (error) {
    next(error);
  }

};



// deletes user's own post
const deletePost = async (req, res, next) => {
  try {
    await deletePostService(req.params.id, req.user.id);
    res.status(200).json({ message: 'post deleted successfully' });

  } catch (error) {
    next(error);
  }

};



export {
  createPost,
  getPosts,
  getPostById,
  getPostLikes,
  toggleLike,
  addComment,
  deletePost,
};