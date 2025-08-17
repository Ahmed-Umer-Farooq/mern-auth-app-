# Deployment Guide

## Backend Deployment to Render

### Prerequisites
1. Create a [Render](https://render.com/) account
2. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
3. Get your MongoDB connection string from MongoDB Atlas

### Steps to Deploy Backend

1. **Prepare MongoDB Atlas:**
   - Create a new cluster in MongoDB Atlas
   - Get your connection string (it should look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)
   - Update your database name in the connection string to `mern-auth`

2. **Deploy to Render:**
   - Fork this repository to your GitHub account
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub account and select your repository
   - Set the following:
     - Name: `mern-auth-backend`
     - Region: Choose the closest region to your users
     - Branch: `main` (or your default branch)
     - Runtime: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variables in Render dashboard:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secure_jwt_secret
     SMTP_HOST=smtp-relay.brevo.com
     SMTP_USER=your_brevo_username
     SMTP_PASS=your_brevo_smtp_password
     SENDER_EMAIL=your_verified_email@domain.com
     FRONTEND_URL=https://your-netlify-app.netlify.app
     ```

3. **Update Frontend Configuration:**
   - Once your backend is deployed, update `client/.env` with your backend URL:
     ```
     VITE_BACKEND_URL=https://your-render-app.onrender.com
     ```

4. **Redeploy Frontend:**
   - Commit and push the updated client/.env file
   - Netlify will automatically redeploy your frontend

### Environment Variables

#### Server Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token signing
- `SMTP_HOST`: SMTP server for sending emails
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SENDER_EMAIL`: Verified sender email address
- `FRONTEND_URL`: Your Netlify frontend URL for CORS

#### Client Environment Variables
- `VITE_BACKEND_URL`: Backend API URL

### Troubleshooting

1. **CORS Issues:**
   - Make sure `FRONTEND_URL` in server environment variables matches your Netlify URL
   - Check that the Netlify URL is in the allowedOrigins array in server.js

2. **Database Connection Issues:**
   - Verify your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for all IPs)
   - Check that your database user has read/write permissions

3. **Email Issues:**
   - Verify your SMTP credentials
   - Make sure your sender email is verified with your email provider

4. **Blank Page on Frontend:**
   - Check browser console for JavaScript errors
   - Verify API calls are being made to the correct backend URL
   - Check Network tab to see if API requests are successful