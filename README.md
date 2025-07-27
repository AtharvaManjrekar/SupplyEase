# Ease Supply - Supply Chain Management Platform

A modern supply chain management platform built with Next.js, Clerk authentication, and MongoDB.

## Features

- 🔐 **Clerk Authentication** - Secure user authentication and management
- 🗄️ **MongoDB Integration** - User data storage and management
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- 🔄 **Webhook Integration** - Automatic user synchronization
- 🛡️ **Protected Routes** - Middleware-based route protection

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ease-supply
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_WEBHOOK_SECRET=your_webhook_secret_here

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here
```

### 4. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your publishable key and secret key
4. Set up webhooks:
   - Go to Webhooks in your Clerk dashboard
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy the webhook secret

### 5. MongoDB Setup

1. Create a MongoDB database (MongoDB Atlas recommended)
2. Get your connection string
3. Add it to your `.env.local` file

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   ├── route.js              # User CRUD operations
│   │   │   └── [clerkId]/
│   │   │       └── route.js          # Individual user operations
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.js          # Clerk webhook handler
│   ├── dashboard/
│   │   └── page.js                   # Protected dashboard
│   ├── home/
│   │   ├── components/
│   │   │   └── Header.js             # Navigation header
│   │   └── page.js                   # Home page
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.js               # Sign in page
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.js               # Sign up page
│   ├── layout.js                     # Root layout with Clerk provider
│   └── page.js                       # Root page
├── lib/
│   └── mongodb.js                    # MongoDB connection utility
├── models/
│   └── User.js                       # User model schema
└── middleware.js                     # Route protection middleware
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/[clerkId]` - Get user by Clerk ID
- `PUT /api/users/[clerkId]` - Update user by Clerk ID
- `DELETE /api/users/[clerkId]` - Delete user by Clerk ID

### Webhooks
- `POST /api/webhooks/clerk` - Handle Clerk webhook events

## User Model

The User model includes the following fields:

```javascript
{
  clerkId: String,        // Clerk user ID
  email: String,          // User email
  firstName: String,      // First name
  lastName: String,       // Last name
  imageUrl: String,       // Profile image URL
  role: String,           // User role (vendor, buyer, admin)
  company: String,        // Company name
  phone: String,          // Phone number
  address: Object,        // Address object
  isVerified: Boolean,    // Verification status
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

## Authentication Flow

1. User signs up through Clerk
2. Clerk webhook triggers `user.created` event
3. Webhook handler creates user record in MongoDB
4. User can access protected routes and dashboard
5. User data is synced between Clerk and MongoDB

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your production environment:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `MONGODB_URI`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
