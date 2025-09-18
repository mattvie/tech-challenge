# Tech Challenge Blog - Technical Documentation

## Overview
This is a full-stack blog application built with Node.js, TypeScript, React, PostgreSQL, Docker, and AWS S3. The application is designed as a technical challenge with both functional features and intentionally broken elements for evaluation purposes.

## Architecture

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens
- **File Storage**: AWS S3
- **Containerization**: Docker

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Styled Components with Design System
- **State Management**: Custom hooks with React Context
- **Routing**: React Router
- **Forms**: React Hook Form

## Features

### Functional Features
1. **User Authentication**
   - User registration and login
   - JWT token-based authentication
   - Protected routes

2. **Blog Posts**
   - Create, read, update, delete posts
   - Rich text content with markdown support
   - Image uploads to S3
   - Post tags and categories
   - View tracking

3. **Comments System**
   - Nested comments (replies)
   - Comment moderation
   - Real-time updates

4. **Likes System**
   - Users can like/unlike posts
   - Like count display

5. **File Upload**
   - Image upload to AWS S3
   - File type validation
   - Size restrictions

### Intentionally Broken Features (For Evaluation)

1. **N+1 Query Problems** (Backend)
   - Post controller fetches likes/comments separately for each post
   - Comment authors are fetched individually
   - Location: `backend/src/controllers/postController.ts`

2. **Performance Issues** (Backend)
   - Missing eager loading in database queries
   - Inefficient database connection pooling
   - Location: `backend/src/config/database.ts`

3. **Broken Tests** (Both)
   - Intentionally failing unit tests
   - Locations: 
     - `backend/src/tests/auth.test.ts`
     - `frontend/src/App.test.tsx`

4. **CSS/Styling Issues** (Frontend)
   - Poor responsive design
   - Accessibility problems
   - Performance-heavy animations
   - Location: `frontend/src/styles/GlobalStyle.ts`

5. **Docker Configuration Issues**
   - Missing restart policies
   - Inefficient layer caching
   - Location: `docker-compose.yml`

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Docker & Docker Compose
- AWS S3 credentials

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd tech-challenge
```

2. Setup environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database and AWS credentials

# Frontend
cp frontend/.env.example frontend/.env.local
```

3. Install dependencies
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

4. Start with Docker
```bash
docker-compose up -d
```

5. Or start manually
```bash
# Start PostgreSQL database
# Update connection settings in backend/.env

# Backend
cd backend && npm run dev

# Frontend (in another terminal)
cd frontend && npm start
```

### Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test
```

### Building

```bash
# Build all
npm run build

# Build backend only
npm run build:backend

# Build frontend only
npm run build:frontend
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tech_challenge_blog
DB_USER=admin
DB_PASSWORD=password123
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1
MAX_FILE_SIZE=5242880
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:3001/api
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Posts Endpoints
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Toggle post like (protected)

### Comments Endpoints
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Upload Endpoints
- `POST /api/upload/image` - Upload image (protected)
- `DELETE /api/upload/image/:key` - Delete image (protected)

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `firstName`, `lastName`
- `avatar`
- `isActive`
- `lastLogin`
- `createdAt`, `updatedAt`

### Posts Table
- `id` (Primary Key)
- `title`
- `content`
- `excerpt`
- `imageUrl`
- `tags` (Array)
- `isPublished`
- `publishedAt`
- `viewCount`
- `authorId` (Foreign Key)
- `createdAt`, `updatedAt`

### Comments Table
- `id` (Primary Key)
- `content`
- `postId` (Foreign Key)
- `authorId` (Foreign Key)
- `parentId` (Foreign Key, nullable)
- `isApproved`
- `createdAt`, `updatedAt`

### Likes Table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `postId` (Foreign Key)
- `createdAt`, `updatedAt`
- Unique constraint on (userId, postId)

## Technical Documentation

### Eager Loading vs Lazy Loading

**What is Eager Loading?**
Eager loading is a design pattern where related data is loaded from the database as part of the initial query, rather than being loaded later when it's accessed.

**Example of N+1 Problem (Intentionally in our code):**
```javascript
// BAD: This causes N+1 queries
const posts = await Post.findAll(); // 1 query
for (const post of posts) {
  const author = await post.getAuthor(); // N queries (one for each post)
  const comments = await post.getComments(); // N more queries
}
```

**Solution with Eager Loading:**
```javascript
// GOOD: This uses only 1 query
const posts = await Post.findAll({
  include: [
    { model: User, as: 'author' },
    { model: Comment, as: 'comments' }
  ]
});
```

### AWS S3 Integration

**S3 Configuration:**
```javascript
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
```

**File Upload Process:**
1. Client selects file
2. Frontend validates file type/size
3. File is uploaded to backend via multipart/form-data
4. Backend validates file again
5. File is uploaded to S3 bucket
6. S3 returns public URL
7. URL is stored in database
8. URL is returned to frontend

**S3 Bucket Permissions:**
- Enable public read access for uploaded files
- Configure CORS for frontend uploads
- Set up lifecycle policies for cleanup

### Docker Configuration

**Multi-Service Setup:**
- PostgreSQL database container
- Backend API container
- Frontend React container
- Shared network for communication

**Key Docker Concepts:**
- **Images**: Built from Dockerfiles
- **Containers**: Running instances of images
- **Networks**: Allow container communication
- **Volumes**: Persistent data storage

**Intentional Docker Issues:**
- Missing restart policies
- No health checks
- Inefficient layer caching

### TypeScript Benefits

**Type Safety:**
```typescript
interface User {
  id: number;
  username: string;
  email: string;
}

// TypeScript catches errors at compile time
const user: User = {
  id: "1", // Error: Type 'string' is not assignable to type 'number'
  username: "john",
  email: "john@example.com"
};
```

**Better IDE Support:**
- Auto-completion
- Refactoring tools
- Error detection
- Documentation

## Performance Optimization

### Database Optimization
1. **Add Indexes**
```sql
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_published_at ON posts(published_at);
```

2. **Query Optimization**
```javascript
// Use eager loading
const posts = await Post.findAll({
  include: [
    { model: User, as: 'author', attributes: ['id', 'username'] },
    { model: Comment, as: 'comments', limit: 5 }
  ],
  order: [['publishedAt', 'DESC']],
  limit: 10
});
```

3. **Connection Pooling**
```javascript
const sequelize = new Sequelize({
  pool: {
    max: 20,      // Maximum connections
    min: 5,       // Minimum connections
    acquire: 30000,
    idle: 10000,
  }
});
```

### Frontend Optimization
1. **Code Splitting**
```javascript
const LazyComponent = React.lazy(() => import('./Component'));
```

2. **Memoization**
```javascript
const MemoizedComponent = React.memo(ExpensiveComponent);
```

3. **Image Optimization**
```javascript
<img 
  src={imageUrl} 
  loading="lazy" 
  alt="Description"
  srcSet={`${imageUrl}?w=300 300w, ${imageUrl}?w=600 600w`}
/>
```

## Security Best Practices

1. **Input Validation**
```javascript
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
```

2. **Password Hashing**
```javascript
const hashedPassword = await bcrypt.hash(password, 12);
```

3. **JWT Security**
```javascript
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);
```

## Troubleshooting Guide

### Common Issues

1. **Database Connection**
   - Check PostgreSQL service status
   - Verify credentials in .env
   - Ensure database exists

2. **S3 Upload Failures**
   - Verify AWS credentials
   - Check bucket permissions
   - Confirm CORS configuration

3. **Build Errors**
   - Clear node_modules
   - Check TypeScript errors
   - Verify all dependencies

## License
This project is licensed under the MIT License.
