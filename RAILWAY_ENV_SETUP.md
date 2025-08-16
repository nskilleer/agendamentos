# Railway Environment Variables Setup

## Required Environment Variables

Your Railway deployment is failing because it's missing critical environment variables. Here are the variables you need to set in Railway:

### 1. MONGODB_URI
**Required**: Yes  
**Description**: MongoDB connection string  
**Example**: `mongodb+srv://username:password@cluster.mongodb.net/agendafacil?retryWrites=true&w=majority`

### 2. SESSION_SECRET
**Required**: Yes  
**Description**: Secret key for session encryption  
**Example**: `your-super-secret-session-key-here-make-it-long-and-random`

### 3. NODE_ENV
**Required**: Yes  
**Description**: Environment mode  
**Value**: `production`

### 4. CORS_ORIGIN
**Required**: Yes  
**Description**: Frontend URL for CORS configuration  
**Value**: `https://agendamentos-production-12c5.up.railway.app`

### 5. PORT
**Required**: No (Railway sets this automatically)  
**Description**: Port number for the server  
**Default**: Railway will set this automatically

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your service (agendamentos)
3. Go to the "Variables" tab
4. Click "New Variable" for each variable above
5. Enter the variable name and value
6. Click "Deploy" to redeploy with new variables

## MongoDB Setup

If you don't have a MongoDB database yet:

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist Railway's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get the connection string and use it as MONGODB_URI

## Current Issue

The application is failing with "Application failed to respond" because:
- The backend can't find the `variaveisambiente.env` file (which doesn't exist in Railway)
- Environment variables are not set in Railway
- Without MONGODB_URI, the app can't connect to the database
- Without SESSION_SECRET, sessions can't be created

## After Setting Variables

Once you set all the environment variables:
1. Railway will automatically redeploy
2. The application should start successfully
3. You can check the deployment logs to confirm everything is working

## Troubleshooting

If the app still doesn't work after setting variables:
1. Check Railway deployment logs
2. Verify MongoDB connection string is correct
3. Ensure MongoDB cluster is running and accessible
4. Check that all variable names are spelled correctly