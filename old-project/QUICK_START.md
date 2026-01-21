# Fort Tracker - Quick Start Guide

Get the Fort Tracker application running on your local system with MySQL in just a few steps!

## Prerequisites

- **MySQL 8.0+** installed and running
- **Node.js 18+** installed
- **npm** package manager

## 🚀 Quick Setup (5 minutes)

### 1. Install MySQL

Choose your operating system:

**Windows:**

- Download and install [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- Set a root password during installation

**macOS:**

```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update && sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. Configure Environment

Create `.env` file in project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=forttracker
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Install & Setup

```bash
# Install dependencies
npm install

# Setup complete database with sample data
npm run db:setup

# Verify everything is working
npm run db:verify

# Start the application
npm run dev
```

### 4. Access Application

- **URL:** http://localhost:8080
- **Admin Login:** admin@forttracker.com / admin123
- **Demo Login:** demo@forttracker.com / demo123

## 🎯 What You Get

### ✅ Complete Database

- **12 tables** with proper relationships
- **Sample forts** with detailed information
- **User accounts** ready to use
- **Reviews and ratings** system
- **Trek planning** functionality

### ✅ Sample Data Included

- **10+ forts** with complete details
- **Admin and demo users**
- **Sample reviews** and ratings
- **Guide contacts**
- **Travel tips** and information

### ✅ All Features Working

- **User authentication** and registration
- **Fort browsing** and searching with **Google Maps directions**
- **Review submission** with photos (auto-approved)
- **Trek groups** discovery and joining
- **Admin dashboard** for content management
- **Dynamic footer** and site content management
- **Trek planning** and management

## 🛠️ Available Commands

```bash
# Database Management
npm run db:setup     # Complete setup with sample data
npm run db:verify    # Verify setup is working
npm run db:reset     # Reset database completely
npm run db:migrate   # Run migrations only
npm run db:seed      # Run seeders only

# Application
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## 🔧 Troubleshooting

### MySQL Connection Issues

```bash
# Check if MySQL is running
# Windows
net start mysql

# macOS
brew services list | grep mysql

# Linux
sudo systemctl status mysql
```

### Authentication Problems

```bash
# Reset MySQL root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'newpassword';
FLUSH PRIVILEGES;
```

### Database Not Found

```bash
# Recreate database
npm run db:reset
```

## 📊 Database Overview

Your local database will contain:

| Table                 | Purpose           | Sample Count |
| --------------------- | ----------------- | ------------ |
| `users`               | User accounts     | 2            |
| `fort_info`           | Fort details      | 10+          |
| `fort_reviews`        | User reviews      | 3+           |
| `content_submissions` | User submissions  | 12+          |
| `guide_contacts`      | Guide information | 2            |
| `additional_info`     | Travel tips       | 2            |
| `trek_plans`          | User trek plans   | 0            |
| `trek_groups`         | Trek groups       | 3            |
| `site_content`        | Dynamic content   | 1            |
| `user_sessions`       | Active sessions   | 0            |

## 🌟 Next Steps

1. **Explore the Admin Panel** at `/admin`

   - Manage fort submissions
   - Approve reviews
   - Manage users

2. **Test User Features**

   - Submit reviews
   - Plan treks
   - Browse forts

3. **Add Your Own Data**

   - Submit new forts
   - Add guide contacts
   - Write reviews

4. **Customize for Production**
   - Change default passwords
   - Update environment variables
   - Configure for your domain

## 🎉 Success!

You now have a fully functional Fort Tracker application with:

- ✅ Complete MySQL database
- ✅ All application features
- ✅ Sample data to explore
- ✅ Admin and user accounts
- ✅ Ready for development or production

Happy trekking! 🏔️
