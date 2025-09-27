# AI Resume Builder - Backend API

A comprehensive Node.js backend API for an AI-powered resume builder application with user authentication, resume management, and file handling capabilities.

## 🚀 Features

- **User Authentication** - JWT-based authentication system
- **Resume Management** - Complete CRUD operations for resumes
- **Default Templates** - Pre-built professional resume templates
- **File Upload Support** - Handle resume thumbnails and documents
- **Security** - User-specific data access and validation
- **MongoDB Integration** - Mongoose ODM for database operations

## 📁 Project Structure

```
backend/
├── controllers/
│   ├── ResumeController.js    # Resume CRUD operations
│   └── UserController.js      # User authentication
├── models/
│   ├── ResumeModel.js        # Resume schema definition
│   └── UserModel.js          # User schema definition
├── middleware/
│   └── authMiddleware.js     # JWT authentication middleware
├── routes/
│   ├── ResumeRoutes.js       # Resume API endpoints
│   └── UserRoutes.js         # User API endpoints
├── uploads/                  # File storage directory
├── server.js                 # Main server file
└── package.json             # Dependencies and scripts
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/ai-resume
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development with nodemon
   npm run dev
   ```

## 📊 Database Schema

### Resume Model
```javascript
{
  userID: ObjectId,           // Reference to user
  title: String,              // Resume title
  thumbnailLink: String,      // Thumbnail image URL
  template: {
    theme: String,            // Template theme name
    colorPalate: [String]     // Color scheme array
  },
  profileInfo: {
    profilePreviewUrl: String, // Profile image URL
    fullName: String,         // User's full name
    designation: String,      // Job title/role
    summary: String           // Professional summary
  },
  contactInfo: {
    email: String,            // Email address
    phone: String,            // Phone number
    location: String,         // Location/address
    linkedin: String,         // LinkedIn profile
    github: String,           // GitHub profile
    website: String           // Personal website
  },
  workExperience: [{
    company: String,          // Company name
    role: String,             // Job role
    startDate: String,        // Start date
    endDate: String,          // End date
    description: String       // Job description
  }],
  education: [{
    degree: String,           // Degree name
    institution: String,      // School/university
    startDate: String,        // Start date
    endDate: String           // End date
  }],
  skills: [{
    name: String,             // Skill name
    progress: Number          // Proficiency level (0-100)
  }],
  projects: [{
    title: String,            // Project title
    description: String,      // Project description
    github: String,           // GitHub repository
    liveDemo: String          // Live demo URL
  }],
  certifications: [{
    title: String,            // Certification name
    issue: String,            // Issuing organization
    year: String              // Year obtained
  }],
  languages: [{
    name: String,             // Language name
    progress: Number          // Proficiency level (0-100)
  }],
  interests: [String]         // Array of interests
}
```

## 🔌 API Endpoints

### Authentication Routes
```
POST   /api/users/register    # Register new user
POST   /api/users/login       # User login
GET    /api/users/profile     # Get user profile (protected)
PUT    /api/users/profile     # Update user profile (protected)
```

### Resume Routes
```
POST   /api/resumes           # Create new resume
GET    /api/resumes           # Get all user resumes
GET    /api/resumes/:id       # Get specific resume
PUT    /api/resumes/:id       # Update resume
DELETE /api/resumes/:id       # Delete resume
POST   /api/resumes/:id/duplicate  # Duplicate resume
```

## 📝 API Usage Examples

### Create a New Resume
```javascript
POST /api/resumes
Headers: {
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
Body: {
  "title": "Software Developer Resume"
}

Response: {
  "success": true,
  "message": "Resume created successfully",
  "data": {
    "_id": "...",
    "title": "Software Developer Resume",
    "userID": "...",
    "template": { ... },
    "profileInfo": { ... },
    // ... other default template data
  }
}
```

### Get All User Resumes
```javascript
GET /api/resumes
Headers: {
  "Authorization": "Bearer <jwt-token>"
}

Response: {
  "success": true,
  "message": "Resumes retrieved successfully",
  "data": [
    {
      "_id": "...",
      "title": "Software Developer Resume",
      "thumbnailLink": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "count": 1
}
```

### Update Resume
```javascript
PUT /api/resumes/:id
Headers: {
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
Body: {
  "profileInfo": {
    "fullName": "John Doe",
    "designation": "Senior Software Developer",
    "summary": "Experienced developer with 5+ years..."
  },
  "skills": [
    { "name": "JavaScript", "progress": 90 },
    { "name": "React", "progress": 85 }
  ]
}

Response: {
  "success": true,
  "message": "Resume updated successfully",
  "data": { ... } // Updated resume object
}
```

## 🎨 Default Template

When creating a new resume, the system automatically populates it with a professional default template:

### Template Features:
- **Modern Theme** with blue color palette
- **Professional Summary** placeholder
- **Sample Work Experience** with formatting guidelines
- **Common Tech Skills** with progress indicators
- **Project Template** structure
- **Education & Certification** sections
- **Language Proficiency** examples
- **Professional Interests** suggestions

### Template Structure:
```javascript
{
  template: {
    theme: "modern",
    colorPalate: ["#2563eb", "#1e40af", "#3b82f6"]
  },
  profileInfo: {
    summary: "Passionate professional with expertise in delivering high-quality solutions..."
  },
  skills: [
    { name: "JavaScript", progress: 85 },
    { name: "React", progress: 80 },
    { name: "Node.js", progress: 75 }
  ],
  // ... other sections with sample data
}
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** for stateless authentication
- **Password Hashing** using bcrypt
- **Protected Routes** requiring valid tokens
- **User Ownership** verification for all resume operations

### Data Validation
- **Input Sanitization** to prevent malicious data
- **Schema Validation** using Mongoose
- **Error Handling** with descriptive messages
- **Rate Limiting** (recommended for production)

## 📁 File Management

### Uploads Directory
The system automatically creates an `uploads` folder for storing:
- Resume thumbnails
- Profile images
- Generated PDF files
- Template assets

```javascript
// Automatic folder creation
const uploadsFolder = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}
```

## 🚀 Controller Functions Explained

### ResumeController.js

#### `createResume(req, res)`
- **Purpose**: Creates a new resume with default template
- **Input**: `{ title: string }`
- **Security**: Requires authentication, associates with user ID
- **Output**: Complete resume object with default data

#### `getUserResumes(req, res)`
- **Purpose**: Retrieves all resumes for authenticated user
- **Input**: None (user ID from token)
- **Security**: User-specific data only
- **Output**: Array of resume summaries (title, thumbnail, dates)

#### `getResumeById(req, res)`
- **Purpose**: Fetches complete resume data for editing
- **Input**: Resume ID in URL params
- **Security**: Ownership verification
- **Output**: Full resume object

#### `updateResume(req, res)`
- **Purpose**: Updates resume with new data
- **Input**: Resume ID + update data
- **Security**: Prevents userID modification
- **Output**: Updated resume object

#### `deleteResume(req, res)`
- **Purpose**: Permanently removes resume
- **Input**: Resume ID in URL params
- **Security**: Ownership verification
- **Output**: Deleted resume confirmation

#### `duplicateResume(req, res)`
- **Purpose**: Creates copy of existing resume
- **Input**: Resume ID in URL params
- **Security**: Ownership verification
- **Output**: New resume with "(Copy)" suffix

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Variables
```env
PORT=4000                    # Server port
MONGODB_URI=mongodb://...    # Database connection
JWT_SECRET=your-secret       # JWT signing key
NODE_ENV=development         # Environment mode
```

### Dependencies
```json
{
  "express": "^4.18.0",      # Web framework
  "mongoose": "^6.0.0",      # MongoDB ODM
  "bcryptjs": "^2.4.0",      # Password hashing
  "jsonwebtoken": "^8.5.0",  # JWT tokens
  "cors": "^2.8.0",          # Cross-origin requests
  "dotenv": "^16.0.0",       # Environment variables
  "multer": "^1.4.0"         # File uploads (optional)
}
```

## 📋 Error Handling

All API responses follow a consistent format:

### Success Response
```javascript
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },           // Actual data
  "count": 5                 // For list operations
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

## 🚀 Production Deployment

### Recommended Environment
- **Node.js** v16+ LTS
- **MongoDB Atlas** for cloud database
- **PM2** for process management
- **Nginx** for reverse proxy
- **SSL Certificate** for HTTPS

### Production Checklist
- [ ] Set strong JWT secret
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up logging
- [ ] Configure file upload limits
- [ ] Enable compression
- [ ] Set up monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for creating professional resumes with AI assistance**
