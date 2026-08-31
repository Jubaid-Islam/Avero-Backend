import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/error.handler.js';
import postsRoutes from './modules/posts/posts.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Post API is running..' });
});


// routes
app.use('/api/posts', postsRoutes);


app.use((req, res, next) => {
  res.status(404).json({ message: 'route not found' });
});


app.use(errorHandler);

export default app;