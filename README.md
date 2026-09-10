# EverZone Backend

Express.js backend for EverZone Admin Dashboard and Frontend.

## Product repository

This service is also maintained as the [`api`](https://github.com/Khant26/everzone/tree/api) branch of the combined [EverZone repository](https://github.com/Khant26/everzone). The original repository is preserved.

## Features

- **Services Management**: Create, read, update, and delete services (image, title, description)
- **Projects Management**: Create, read, update, and delete projects with categories
- **Categories Management**: Manage project categories
- **Contact Forms**: Handle customer inquiries with status tracking

## Tech Stack

- **Framework**: Express.js
- **Database**: PostgreSQL
- **Runtime**: Node.js
- **Package Manager**: npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd everzone-api
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your PostgreSQL credentials:
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=everzone_db
DB_USER=postgres
DB_PASSWORD=your_password

CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

5. Create PostgreSQL database:
```bash
createdb everzone_db
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

**Body:**
```json
{
  "title": "Service Title",
  "description": "Service Description",
  "image": "image_url"
}
```

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Body:**
```json
{
  "name": "Category Name",
  "description": "Category Description"
}
```

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/category/:categoryId` - Get projects by category
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

**Body:**
```json
{
  "name": "Project Name",
  "title": "Project Title",
  "category_id": 1,
  "location": "City, Country",
  "duration": "3 months",
  "area": "500 sq ft",
  "description": "Project Description",
  "image": "image_url"
}
```

### Contact Forms
- `GET /api/contact-forms` - Get all contact forms
- `GET /api/contact-forms/:id` - Get contact form by ID
- `POST /api/contact-forms` - Submit contact form
- `PUT /api/contact-forms/:id/status` - Update form status
- `DELETE /api/contact-forms/:id` - Delete contact form

**Body (Submit):**
```json
{
  "name": "Customer Name",
  "email": "customer@email.com",
  "phone": "+1234567890",
  "message": "How can we help?"
}
```

**Body (Update Status):**
```json
{
  "status": "pending | read | responded"
}
```

## Database Schema

### services
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### projects
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  location VARCHAR(255),
  duration VARCHAR(100),
  area VARCHAR(100),
  description TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### contact_forms
```sql
CREATE TABLE contact_forms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
everzone-api/
├── src/
│   ├── config/
│   │   ├── database.js       # Database connection
│   │   └── initDb.js         # Database initialization
│   ├── controllers/
│   │   ├── ServiceController.js
│   │   ├── CategoryController.js
│   │   ├── ProjectController.js
│   │   └── ContactFormController.js
│   ├── models/
│   │   ├── ServiceModel.js
│   │   ├── CategoryModel.js
│   │   ├── ProjectModel.js
│   │   └── ContactFormModel.js
│   ├── routes/
│   │   ├── serviceRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── projectRoutes.js
│   │   └── contactFormRoutes.js
│   └── server.js             # Main server file
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment mode |
| DB_HOST | localhost | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | everzone_db | Database name |
| DB_USER | postgres | Database user |
| DB_PASSWORD | - | Database password |
| CORS_ORIGIN | * | Allowed CORS origins |

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Development

For development with auto-reload:
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Notes

- All timestamps are in UTC
- IDs are auto-generated by PostgreSQL
- Email validation is performed on contact form submission
- Cascade delete is enabled for projects when a category is deleted
