# Task Management Application

This project is a Task Management Application developed with role-based access control (RBAC). It allows Admin and User roles with different permissions to manage tasks effectively. Admin can create, delete, and access all tasks, while Users can only view and update the status of their own tasks. This application uses React.js for the frontend, Node.js & Express.js for the backend, and MongoDB for the database.

## Features

- **User Authentication**: Users can register and log in using JWT-based authentication.
- **Role-Based Access Control**: Different permissions for Admin and User roles.
- **Task Management**:
  - **Admin**: Can create, delete, and view all tasks.
  - **User**: Can view and update the status of only their tasks.
- **Task Status**: Tasks can have statuses such as "Pending", "In Progress", and "Completed".
- **Frontend**: Built with React.js and styled using MUI.
- **Backend**: Built with Node.js and Express.js, implementing role-based access control.
- **Database**: MongoDB for task and user storage.

## Technologies Used

- **Frontend**: React.js, MUI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Testing**: Postman
- **Deployment**: Vercel

## Deployment Links

- **Frontend**: https://task-management-application-eobe.vercel.app/
- **Backend**:  https://task-management-application-orpin.vercel.app/

## API Documentation

All APIs are documented using Postman. You can test the API using the link below:
- **Postman API Documentation**: [Postman Documentation Link](https://documenter.getpostman.com/view/24268208/2sAYQgiohr)

### Admin API Routes

1. **Create Task**:
   - `POST /tasks/create` - Create Task
2. **Signup**:
   - `POST /auth/register` - Signup
3. **Login**:
   - `POST /auth/login` - Login
4. **Get Tasks**:
   - `GET /tasks` - Get All Tasks
5. **Delete Task**:
   - `DELETE /tasks/:id` - Delete Task

### User API Routes

1. **Signup**:
   - `POST /auth/register` - Signup
2. **Login**:
   - `POST /auth/login` - Login
3. **Get All Users**:
   - `GET /auth/users` - Get Users
4. **Get Own Tasks**:
   - `GET /tasks/user` - Get Own Tasks
5. **Update Task**:
   - `PUT /tasks/:id` - Update Task

### Backend API Endpoints

#### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login with JWT-based authentication.

#### Admin Routes
- `GET /tasks`: View all tasks.
- `POST /tasks`: Create a new task.
- `DELETE /tasks/:id`: Delete any task.

#### User Routes
- `GET /tasks`: View only assigned tasks.
- `PUT /tasks/:id`: Update the status of the user's own task.

## Project Setup

1. **Clone repository**:
   ```bash
   https://github.com/Summi51/Task-Management-Application
   
2. **Frontend Setup**:

- cd task-management-app-frontend
- npm install
- npm start

3. **Backend Setup**:

- cd task-management-app-backend
- npm install
- npm start
