# Avero - Backend API

A robust, secure, and scalable RESTful API built with Node.js, Express, and MongoDB to power the Avero social media ecosystem.

## Features

- Authentication & Authorization: Secure user registration, authentication, and token-based route protection.
- Post & Feed Management: Endpoints for creating posts, fetching feeds, and retrieving detailed post metadata.
- Interactive Engagement: High-concurrency support for likes and comment streams with optimized data retrieval.
- Data Integrity & Hashing: Automated checks to ensure secure data handling and synchronization.
- Error & Security Handling: Graceful standard HTTP status codes (e.g., 401 Unauthorized handling) to prevent client-side polling loops.

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JSON Web Tokens (JWT) & bcrypt.js
- Environment Management: dotenv

## Getting Started

### Prerequisites

Ensure you have the following installed on your environment:

- Node.js (v16.x or higher)
- npm or yarn
- MongoDB Instance (Local or MongoDB Atlas)

### Installation

1. Clone the repository:
   git clone https://github.com/your-username/avero-backend.git

2. Navigate to the project directory:
   cd avero-backend

3. Install dependencies:
   npm install

4. Environment Configuration:
   Create a `.env` file in the root directory and configure the following variables:
   
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/avero
   JWT_SECRET=your_jwt_secret_key

5. Start the server:

   Development mode (with auto-reload):
   npm run dev

   Production mode:
   npm start

The server will be running on `http://localhost:5000`.

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and obtain token

### Posts & Interactions
- `GET /api/posts` - Fetch global post feed
- `GET /api/posts/:id` - Fetch single post details
- `POST /api/posts` - Create a new post (Protected)
- `DELETE /api/posts/:id` - Delete a post (Protected)
- `GET /api/posts/:id/likes` - Fetch users who liked the post
- `POST /api/posts/:id/like` - Toggle like status on a post (Protected)

## Error Handling

The API returns consistent JSON error responses across all routes:

```json
{
  "message": "Unauthorized access. Token missing or invalid."
}