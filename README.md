# MERN Authentication App

A full-stack authentication application built with the MERN stack (MongoDB, Express, React, Node.js) featuring user registration, login, email verification, and password reset functionality.

## Features

- User Registration and Login
- Email Verification with OTP
- Password Reset with OTP
- JWT Authentication
- Protected Routes
- Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-auth-app
```

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mern-auth
   JWT_SECRET=your_secure_jwt_secret_here
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_USER=your_brevo_username
   SMTP_PASS=your_brevo_smtp_password
   SENDER_EMAIL=your_verified_email@domain.com
   ```

4. Start the server:
   ```bash
   npm run server
   ```

### 3. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install client dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `client` directory with the following variable:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Start the client:
   ```bash
   npm run dev
   ```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Deployment

For deployment instructions, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## Project Structure

```
mern-auth-app/
├── client/              # React frontend
│   ├── public/          # Static assets
│   ├── src/             # React components and logic
│   ├── .env             # Frontend environment variables
│   └── package.json     # Frontend dependencies
├── server/              # Node.js backend
│   ├── config/          # Database and email configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── .env             # Backend environment variables
│   └── server.js        # Entry point
├── DEPLOYMENT.md        # Deployment instructions
└── README.md            # This file
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /send-verify-otp` - Send email verification OTP
- `POST /verify-account` - Verify email with OTP
- `POST /is-authenticated` - Check if user is authenticated
- `POST /send-password-reset-otp` - Send password reset OTP
- `POST /verify-password-reset-otp` - Verify password reset OTP
- `POST /reset-password` - Reset password with OTP

### User Routes (`/api/user`)
- `GET /data` - Get user data (authenticated)

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer with Brevo (Sendinblue)
- **Deployment**: Netlify (frontend), Railway (backend)

## Troubleshooting

1. **CORS Errors**: Ensure the backend URL in `server.js` includes your frontend domain
2. **Email Not Sending**: Verify SMTP credentials and sender email in environment variables
3. **Database Connection Issues**: Check MongoDB connection string and network access
4. **JWT Errors**: Ensure JWT_SECRET is set and consistent between login/registration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.