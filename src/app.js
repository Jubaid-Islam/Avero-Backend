import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/error.handler.js';
import postsRoutes from './modules/posts/posts.routes.js';
import usersRoutes from './modules/users/user.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Postman/curl বা server-to-server request (no origin header) allow করতে
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
}));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Post API is running..' });
});

// routes
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'route not found' });
});

app.use(errorHandler);

export default app;