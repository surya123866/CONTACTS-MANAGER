# Contact Manager Application

This is a simple Contact Manager application built with **Node.js** for the backend and **React.js** for the frontend. It supports basic CRUD (Create, Read, Update, Delete) operations for managing contacts.

---

## Features

- Create new contacts
- View a list of contacts
- Update contact information
- Delete contacts

---

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (for database)

---

## Installation

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder with the following configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/contact-manager
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will be running on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will be running on `http://localhost:3000`.

---

## API Endpoints

### Base URL
`http://localhost:5000/api/contacts`

### Endpoints

| Method | Endpoint           | Description                 |
|--------|--------------------|-----------------------------|
| GET    | `/`                | Fetch all contacts          |
| GET    | `/:id`             | Fetch a single contact      |
| POST   | `/`                | Create a new contact        |
| PUT    | `/:id`             | Update an existing contact  |
| DELETE | `/:id`             | Delete a contact            |

---

## Folder Structure

### Backend

```
backend/
├── controllers/
├── models/
├── routes/
├── config/
├── server.js
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.js
│   ├── index.js
├── public/
└── package.json
```

---

## How to Use

1. Start both the backend and frontend servers.
2. Open your browser and go to `http://localhost:3000`.
3. Use the interface to add, edit, view, and delete contacts.

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Frontend
- React.js
- Axios (for API calls)
- React Router (for navigation)

---

## Future Enhancements

- Add user authentication
- Implement search and filter functionality
- Add pagination for contact lists
- Enhance UI/UX

---

## License

_____
