# Product Management System

A complete, simple, and professional Product Management System built with the **MERN** stack (MongoDB, Express.js, React, Node.js) for technical interview demonstration.

---

## Features

- **User Registration & Validation**: Full name, email format check, minimum 6-character password, password confirmation matching, and duplicate email prevention.
- **User Login & JWT Authentication**: Secure credentials verification with bcryptjs password hashing and JWT token generation.
- **Protected Product Management**: All product routes require valid JWT authorization via Bearer token.
- **Product CRUD**:
  - **Create**: Add new products with validation (Name, Price > 0, Category, Description).
  - **Read/List**: View all products in a responsive, clean table view.
  - **Edit**: Inline modal pre-filled with existing data to modify product details.
  - **Delete**: Removal with modal confirmation to avoid accidental deletion.
- **Server-Side Product Search**: Search products in real time by name and category (case-insensitive) using the backend REST API (`GET /api/products?search=keyword`).
- **Form Validation**: Strict client and server-side validation with clear, user-friendly error messages.
- **MongoDB Integration**: Structured Mongoose schemas with data sanitization and indexing.
- **Responsive & Modern UI**: Built with React and modern CSS without heavy external CSS frameworks.

---

## Tech Stack

### Frontend
- **React 19**
- **Vite**
- **React Router v7**
- **Axios** (with Bearer token request and 401 response interceptors)
- **Vanilla CSS** (CSS custom properties, modern responsive cards/tables, modal dialogs)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JSON Web Tokens (jsonwebtoken)**
- **bcryptjs** (Password hashing)
- **CORS**
- **dotenv**

---

## Project Structure

```text
productmanagament/
├── backend/                  # Express REST API
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/                 # Vite React application
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductFormModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a MongoDB Atlas URI)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file inside the `backend/` folder (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Configure the following variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/product_management
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Run the backend server:
   - For development with auto-reload:
     ```bash
     npm run dev
     ```
   - For standard production start:
     ```bash
     npm start
     ```
   The backend will run at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

---

## REST API Endpoints

### Authentication

| Method | Endpoint             | Access  | Description                      |
|--------|----------------------|---------|----------------------------------|
| `POST` | `/api/auth/register` | Public  | Register a new user and get JWT  |
| `POST` | `/api/auth/login`    | Public  | Authenticate user and get JWT    |

#### Register Request Body:
```json
{
  "name": "Alex Smith",
  "email": "alex@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login Request Body:
```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```

### Products (Protected by JWT)

Include header: `Authorization: Bearer <token>`

| Method   | Endpoint                  | Access   | Description                                          |
|----------|---------------------------|----------|------------------------------------------------------|
| `GET`    | `/api/products`           | Private  | Fetch all products                                   |
| `GET`    | `/api/products?search=kw` | Private  | Search products by name and category (case-insensitive)|
| `POST`   | `/api/products`           | Private  | Create a new product                                 |
| `PUT`    | `/api/products/:id`       | Private  | Update existing product by ID                        |
| `DELETE` | `/api/products/:id`       | Private  | Delete product by ID                                 |

#### Product Payload:
```json
{
  "name": "Wireless Noise-Canceling Headphones",
  "price": 199.99,
  "category": "Electronics",
  "description": "Premium over-ear headphones with active noise cancellation."
}
```
