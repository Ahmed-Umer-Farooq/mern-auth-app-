# MERN Authentication App - Optimized for Deployment

This is an optimized version of the MERN authentication app with improved package versions and deployment configurations.

## 🚀 Deployment Optimizations

### Netlify Configuration
- Added `netlify.toml` with optimized build settings
- Specified Node.js version 16 for better compatibility
- Added `NPM_FLAGS = "--prefer-offline"` to speed up builds

### Package Updates
- Downgraded React from v19 to v18 for stability
- Updated dependencies to more stable versions
- Moved nodemon to devDependencies in server package.json

## 📦 Installation

### Backend (Server)
```bash
cd server
npm install
```

### Frontend (Client)
```bash
cd client
npm install
```

## 🚀 Deployment Instructions

### Deploy Backend to Railway
1. Connect your GitHub repository to Railway
2. Set root directory to `server`
3. Add environment variables:
   - PORT=5000
   - NODE_ENV=production
   - MONGODB_URI=your_mongodb_connection_string
   - JWT_SECRET=your_secure_jwt_secret
   - SMTP_HOST=smtp-relay.brevo.com
   - SMTP_USER=your_brevo_username
   - SMTP_PASS=your_brevo_smtp_password
   - SENDER_EMAIL=your_verified_email@brevo.com

### Deploy Frontend to Netlify
1. Connect your GitHub repository to Netlify
2. Build settings are configured in `netlify.toml`:
   - Base directory: `client/`
   - Publish directory: `dist/`
   - Build command: `npm install && npm run build`

## 🛠️ Environment Variables

### Frontend (.env in client directory)
```
VITE_BACKEND_URL=https://your-railway-backend-url.railway.app
```

### Backend (.env in server directory)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
SMTP_HOST=smtp-relay.brevo.com
SMTP_USER=your_brevo_username
SMTP_PASS=your_brevo_smtp_password
SENDER_EMAIL=your_verified_email@brevo.com
```

## 🧪 Testing

After deployment:
1. Visit your Netlify frontend URL
2. Test user registration and login
3. Verify email functionality
4. Test password reset

## 🆘 Troubleshooting

If you encounter deployment issues:
1. Check build logs in Netlify and Railway dashboards
2. Ensure all environment variables are set correctly
3. Verify MongoDB connection string and credentials
4. Check that Brevo SMTP settings are correct