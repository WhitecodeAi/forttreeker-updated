# Fort Tracker - MySQL Database Setup Guide

This guide will help you set up the complete MySQL database for the Fort Tracker application on your local system.

## Prerequisites

1. **MySQL 8.0 or higher** installed on your system
2. **Node.js 18 or higher** installed
3. **npm** package manager

## Option 1: Quick Setup (Recommended)

### Step 1: Install MySQL
**On Windows:**
1. Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Run the installer and choose "Developer Default"
3. Set root password (remember this!)
4. Complete the installation

**On macOS:**
```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Secure installation
mysql_secure_installation
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### Step 2: Configure Database Connection
1. Create/update `.env` file in the project root:
```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=forttracker

# Application Settings
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Database Setup Script
```bash
# This will create the database, tables, and seed sample data
node scripts/setup-database.js
```

### Step 5: Start the Application
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Option 2: Manual Setup

### Step 1: Create Database
Connect to MySQL as root:
```bash
mysql -u root -p
```

Run the complete setup:
```sql
SOURCE database/setup.sql;
```

Or run individual scripts:
```sql
SOURCE database/migrations/001_create_tables.sql;
SOURCE database/seeders/002_seed_users.sql;
SOURCE database/seeders/003_seed_static_forts.sql;
```

### Step 2: Verify Setup
```sql
USE forttracker;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM fort_info;
SELECT COUNT(*) FROM fort_reviews;
```

## Option 3: Docker MySQL (Alternative)

### Step 1: Start MySQL with Docker
```bash
# Using the provided docker-compose.yml
docker-compose up -d mysql

# Wait for MySQL to be ready (about 30 seconds)
docker-compose logs mysql
```

### Step 2: Run Setup Script
```bash
# The database will be accessible on localhost:3306
node scripts/setup-database.js
```

## Database Schema Overview

The database includes these main tables:

### Core Tables
- **`users`** - User accounts and authentication
- **`user_sessions`** - Session management
- **`fort_reviews`** - User reviews and photos
- **`trek_plans`** - User trek planning data

### Content Management
- **`content_submissions`** - All user-submitted content
- **`fort_info`** - Approved fort information
- **`guide_contacts`** - Verified guide contacts
- **`additional_info`** - Travel tips and guides
- **`trek_enquiries`** - Trek booking requests
- **`file_uploads`** - File management

## Default Login Credentials

After setup, you can login with:

**Admin Account:**
- Email: `admin@forttracker.com`
- Password: `admin123`
- Role: Administrator (full access)

**Demo Account:**
- Email: `demo@forttracker.com`
- Password: `demo123`
- Role: Regular User

> **Important:** Change these passwords in production!

## Troubleshooting

### Connection Issues
1. **Authentication Error:**
   ```bash
   # Reset MySQL root password
   sudo mysql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
   FLUSH PRIVILEGES;
   ```

2. **Port Already in Use:**
   - Check if MySQL is running: `sudo systemctl status mysql`
   - Stop other MySQL instances: `sudo systemctl stop mysql`

3. **Permission Denied:**
   ```bash
   # Grant privileges to root
   sudo mysql
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   ```

### Database Issues
1. **Tables Not Created:**
   ```bash
   # Re-run migrations
   mysql -u root -p forttracker < database/migrations/001_create_tables.sql
   ```

2. **No Sample Data:**
   ```bash
   # Re-run seeders
   mysql -u root -p forttracker < database/seeders/002_seed_users.sql
   mysql -u root -p forttracker < database/seeders/003_seed_static_forts.sql
   ```

3. **Reset Database:**
   ```sql
   DROP DATABASE IF EXISTS forttracker;
   SOURCE database/setup.sql;
   ```

## Application Features

Once setup is complete, your application will have:

### ✅ User Features
- User registration and authentication
- Fort browsing and searching
- Review submission (with photos)
- Trek planning and management
- Content submission

### ✅ Admin Features
- Content management dashboard
- User management
- Review moderation
- Fort information approval
- Guide contact verification

### ✅ Database Features
- Full-text search on forts and guides
- JSON storage for complex data
- Proper indexing for performance
- Foreign key constraints for data integrity
- Automatic timestamps and updates

## Performance Optimization

The database includes several optimizations:

1. **Indexes** on frequently queried columns
2. **Full-text search** for content discovery
3. **JSON storage** for flexible data structures
4. **Foreign key constraints** for data integrity
5. **UTF8MB4** character set for emoji support

## Development Tips

1. **Database GUI Tools:**
   - MySQL Workbench (Official)
   - phpMyAdmin (Web-based)
   - DBeaver (Cross-platform)
   - TablePlus (macOS/Windows)

2. **Backup Database:**
   ```bash
   mysqldump -u root -p forttracker > backup.sql
   ```

3. **Restore Database:**
   ```bash
   mysql -u root -p forttracker < backup.sql
   ```

4. **Monitor Performance:**
   ```sql
   SHOW PROCESSLIST;
   SHOW STATUS LIKE 'Slow_queries';
   ```

## Production Deployment

For production, consider:

1. **Cloud MySQL Services:**
   - AWS RDS
   - Google Cloud SQL
   - Azure Database for MySQL
   - PlanetScale
   - Railway

2. **Security:**
   - Use environment variables for credentials
   - Enable SSL connections
   - Regular security updates
   - Database user with minimal privileges

3. **Monitoring:**
   - Set up database monitoring
   - Configure backup schedules
   - Monitor performance metrics

## Support

If you encounter issues:

1. Check the application logs in the terminal
2. Verify MySQL is running: `sudo systemctl status mysql`
3. Test database connection: `mysql -u root -p`
4. Review error messages in the setup script output

The application is now fully configured to use your local MySQL database for all data storage and operations!
