# 🚀 Deployment Guide

This guide will help you deploy your MERN authentication app to production.

## 📋 Prerequisites

1. **GitHub Account**: To host your code
2. **MongoDB Atlas Account**: For cloud database
3. **Email Service**: Brevo (formerly Sendinblue) for email functionality
4. **Deployment Platforms**: Netlify (frontend) + Railway/Render (backend)

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 1.3 Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password
4. Select "Read and write to any database"
5. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

## 📧 Step 2: Set Up Email Service (Brevo)

### 2.1 Create Brevo Account
1. Go to [Brevo](https://www.brevo.com/)
2. Sign up for a free account
3. Verify your email address

### 2.2 Get SMTP Credentials
1. Go to "SMTP & API" in the left sidebar
2. Click "SMTP" tab
3. Note down your SMTP credentials:
   - SMTP Server: `smtp-relay.brevo.com`
   - Port: `587`
   - Username: Your Brevo username
   - Password: Your SMTP password

### 2.3 Verify Sender Email
1. Go to "Senders & IP" in the left sidebar
2. Add and verify your sender email address

## 🌐 Step 3: Deploy Backend (Railway)

### 3.1 Create Railway Account
1. Go to [Railway](https://railway.app/)
2. Sign up with your GitHub account

### 3.2 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Set the root directory to `server`
5. Railway will automatically detect it's a Node.js app

### 3.3 Configure Environment Variables
In Railway dashboard, add these environment variables:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-auth
JWT_SECRET=your_secure_jwt_secret_here
SMTP_HOST=smtp-relay.brevo.com
SMTP_USER=your_brevo_username
SMTP_PASS=your_brevo_smtp_password
SENDER_EMAIL=your_verified_email@domain.com
```

For local development, create a `.env` file in the `server` directory with:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_secure_jwt_secret_here
SMTP_HOST=smtp-relay.brevo.com
SMTP_USER=your_brevo_username
SMTP_PASS=your_brevo_smtp_password
SENDER_EMAIL=your_verified_email@domain.com
```

### 3.4 Get Backend URL
1. After deployment, Railway will provide a URL
2. Copy this URL (e.g., `https://your-app.railway.app`)

## 🎨 Step 4: Deploy Frontend (Netlify)

### 4.1 Create Netlify Account
1. Go to [Netlify](https://netlify.com/)
2. Sign up with your GitHub account

### 4.2 Deploy Frontend
1. Click "New site from Git"
2. Choose your GitHub repository
3. Configure build settings:
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/dist`
4. Click "Deploy site"

### 4.3 Configure Environment Variables
In Netlify dashboard:
1. Go to "Site settings" → "Environment variables"
2. Add: `VITE_BACKEND_URL=https://your-backend-url.railway.app`

For local development, create a `.env` file in the `client` directory with:
```
VITE_BACKEND_URL=http://localhost:5000
```

### 4.4 Update CORS Settings
In your backend `server.js`, update the allowed origins:
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-netlify-app.netlify.app"
];
```

## 🔧 Step 5: Update Frontend Configuration

### 5.1 Update Backend URL
In your frontend code, make sure the backend URL is configured correctly:
```javascript
// In client/src/context/appContext.jsx
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
```

### 5.2 Test the Deployment
1. Visit your Netlify URL
2. Test registration, login, and email verification
3. Check if emails are being sent

## 🛠️ Troubleshooting

### Common Issues

#### 1. CORS Errors
- Make sure your backend CORS settings include your frontend URL
- Check that the backend URL in frontend environment variables is correct

#### 2. Database Connection Issues
- Verify your MongoDB Atlas connection string
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

#### 3. Email Not Sending
- Verify Brevo SMTP credentials
- Check that sender email is verified
- Ensure environment variables are set correctly

#### 4. Build Errors
- Check that all dependencies are in package.json
- Verify Node.js version compatibility
- Check for any missing environment variables

### Debugging Tips

1. **Check Railway Logs**: View deployment logs in Railway dashboard
2. **Check Netlify Logs**: View build logs in Netlify dashboard
3. **Test API Endpoints**: Use Postman or similar tool to test backend endpoints
4. **Browser Console**: Check for frontend errors in browser developer tools

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files to Git
2. **JWT Secret**: Use a strong, random JWT secret
3. **Database Security**: Use strong passwords for database users
4. **HTTPS**: Both Netlify and Railway provide HTTPS by default
5. **CORS**: Only allow necessary origins in CORS settings

## 📊 Monitoring

1. **Railway**: Monitor backend performance and logs
2. **Netlify**: Monitor frontend builds and performance
3. **MongoDB Atlas**: Monitor database performance and usage
4. **Brevo**: Monitor email delivery rates

## 🔄 Continuous Deployment

Both Railway and Netlify will automatically redeploy when you push changes to your GitHub repository.

## 📝 Final Checklist

- [ ] MongoDB Atlas database created and configured
- [ ] Brevo email service set up
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Netlify
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] All features tested (registration, login, email verification)
- [ ] Custom domain configured (optional)

Your MERN authentication app is now live! 🎉 