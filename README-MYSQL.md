# MySQL Database Setup

This application now uses MySQL as its primary database. Here are the setup options:

## Option 1: Docker MySQL (Recommended for Development)

1. **Start MySQL with Docker Compose:**
   ```bash
   docker-compose up -d mysql
   ```

2. **The application will automatically:**
   - Create the database if it doesn't exist
   - Run all necessary migrations
   - Set up tables with proper indexes
   - Create a default admin user

3. **Access phpMyAdmin (optional):**
   - URL: http://localhost:8081
   - Username: root
   - Password: password

## Option 2: Local MySQL Installation

1. **Install MySQL 8.0+**
2. **Create database:**
   ```sql
   CREATE DATABASE forttracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Update environment variables:**
   - DB_HOST=localhost
   - DB_PORT=3306
   - DB_USER=root
   - DB_PASSWORD=your_password
   - DB_NAME=forttracker

## Option 3: Cloud MySQL (Production)

For production deployments, use cloud MySQL services:
- **AWS RDS MySQL**
- **Google Cloud SQL**
- **Azure Database for MySQL**
- **PlanetScale**
- **Railway**

Update the environment variables with your cloud database credentials.

## Database Schema

The application includes these tables:
- `users` - User authentication and profiles
- `user_sessions` - Session management
- `fort_reviews` - User reviews and photos
- `trek_plans` - User trek planning data
- `content_submissions` - User-submitted content
- `fort_info` - Approved fort information
- `guide_contacts` - Verified guide contacts
- `additional_info` - Travel tips and guides
- `trek_enquiries` - Trek booking requests
- `file_uploads` - File management

## Default Admin User

A default admin user is created:
- **Email:** admin@nomadtrekkers.org
- **Password:** admin123
- **Change this password immediately in production!**

## Environment Variables

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=forttracker

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Migration Status

The application automatically:
1. Checks if the database exists
2. Creates it if needed
3. Runs migrations if tables don't exist
4. Seeds initial data
5. Verifies the connection

All database operations use proper MySQL syntax with:
- UTF8MB4 character set
- InnoDB storage engine
- Proper foreign key constraints
- Optimized indexes
- JSON data types where appropriate
