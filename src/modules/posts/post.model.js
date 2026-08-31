import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

    username: {
        type: String,
        required: true,
    },

    text: {
        type: String,
        trim: true,
    },

    imageUrl: {
        type: String,
        default: '',
    },

    publicId: {
        type: String,
        default: '',
    },

    likes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
        },
    ],

    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            text: {
                type: String,
                required: true,
                trim: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    likesCount: {
        type: Number,
        default: 0,
    },

    commentsCount: {
        type: Number,
        default: 0,
    }
},
    {
        timestamps: true,
    }

)

export default mongoose.model('Post', postSchema);