# Introduction
It is a full-stack social media platform built with the MERN (MongoDB, Express, React, Node.js) stack, designed to deliver a modern user experience with essential social networking features. The platform enables users to:

- 🔐 Create secure user accounts with authentication
- 📝 Publish and manage multimedia posts
- ❤️ Engage through likes and comments
- 📸 Upload and manage media content via Cloudinary

# Tech Stack
## Core Stack
| Category         | Technologies                                                                 |
|------------------|------------------------------------------------------------------------------|
| **Frontend**     | React 18 + Redux Toolkit, React Router 6, CSS3 Grid/Flexbox, Axios           |
| **Backend**      | Node.js 18 + Express 4.18, RESTful API Design, JWT Authentication            |
| **Database**     | MongoDB                                                                      |
| **Cloud Services**| Cloudinary Media Management, Nginx Reverse Proxy                            |
| **DevOps**       | Git Version Control, Postman API Testing, Dotenv Configuration               |

## Prerequisites
- Node.js 18.x+
- MongoDB
- Cloudinary API credentials

## Run

Before starting the server, ensure all necessary environment variables are set in the `.env` file inside the backend folder.

```bash
# Cloudinary Configuration
CLOUD_API_KEY=
CLOUD_API_SECRET=
CLOUD_NAME=

# JWT Configuration
JWT_LIFETIME=
JWT_SECRET=

# MongoDB Connection
MONGO_URI=

MODE=DEV
```
Run the following command in both the frontend and backend folders: 
```bash
npm install
npm start  
```

## Advanced Configuration

- **Secure MongoDB connection:** Use a safe and encrypted connection string.
- **HTTPS setup:** For secure deployment, consider using Nginx as a reverse proxy.

# Acknowledgements
Special thanks to my girl and her cat Meiqiu—you gave me the opportunity to learn and deploy this application. ❤️