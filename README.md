# MERN Authentication App

A full-stack user authentication application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

- User registration and login
- Email verification with OTP
- Password reset functionality
- JWT-based authentication
- Responsive design
- Protected routes

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Nodemailer
- bcryptjs

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Clone the repository
```bash
git clone <your-repository-url>
cd mern-auth-app
```

### Install dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

## ⚙️ Environment Variables

### Backend (.env)
Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret_key_here
SMTP_HOST=smtp-relay.brevo.com
SMTP_USER=your_brevo_smtp_username
SMTP_PASS=your_brevo_smtp_password
SENDER_EMAIL=your_verified_sender_email@yourdomain.com
```

### Frontend (.env)
Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd server
npm start
```

#### Start Frontend Development Server
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
mern-auth-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── assets/       # Static assets
│   ├── public/
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── package.json
└── README.md
```

## 🌐 Deployment

### Frontend Deployment (Netlify)

1. Build the frontend:
```bash
cd client
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `cd client && npm install && npm run build`
   - Set publish directory: `client/dist`
   - Add environment variable: `VITE_BACKEND_URL=https://your-backend-url.com`

### Backend Deployment (Railway/Render)

1. Deploy to Railway or Render:
   - Connect your GitHub repository
   - Set root directory to `server`
   - Add environment variables
   - Set build command: `npm install`
   - Set start command: `npm start`

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update your backend environment variables

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/send-verify-otp` - Send email verification OTP
- `POST /api/auth/verify-account` - Verify email with OTP
- `POST /api/auth/send-password-reset-otp` - Send password reset OTP
- `POST /api/auth/verify-password-reset-otp` - Verify password reset OTP
- `POST /api/auth/reset-password` - Reset password

### User
- `GET /api/user/data` - Get user data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React.js team
- Node.js community
- MongoDB team
- All contributors and supporters 