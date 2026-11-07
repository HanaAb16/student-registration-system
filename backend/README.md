# Student Registration System

**Developer:** Hana Abiyu  
**Contact:** hanaabiyu15@gmail.com

A full-stack web application for managing student records, built with Laravel (Backend API) and React (Frontend).

## Prerequisites

- PHP 8.x and Composer
- Node.js and npm
- MySQL (via XAMPP or similar)

## Backend Setup (Laravel)

1. Open a terminal and navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install PHP dependencies:

   ```bash
   composer install
   ```

3. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

4. Open the `.env` file and update your database credentials:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3307
   DB_DATABASE=student_registration
   DB_USERNAME=root
   DB_PASSWORD=
   ```

   **Note:** Update `DB_PORT` to `3306` if you are using the default MySQL port.

5. Generate the application key:

   ```bash
   php artisan key:generate
   ```

6. Run database migrations to create tables:

   ```bash
   php artisan migrate
   ```

7. Start the development server:

   ```bash
   php artisan serve
   ```

   The backend will run at: http://127.0.0.1:8000

## Frontend Setup (React)

1. Open a new terminal and navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install JavaScript dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

   The frontend will run at: http://localhost:5173

## API Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/students` | Fetch list of all students | None | `200 OK` (Array) |
| `POST` | `/api/students` | Register a new student | JSON (All fields) | `201 Created` (Object) |
| `GET` | `/api/students/{id}` | View a single student | None | `200 OK` (Object) |
| `PUT` | `/api/students/{id}` | Update an existing student | JSON (All fields) | `200 OK` (Object) |
| `DELETE` | `/api/students/{id}` | Delete a student | None | `204 No Content` |

**Error Handling:** Invalid requests to `POST` or `PUT` return a `422 Unprocessable Entity` status with JSON validation errors. Missing records return a `404 Not Found`.

## Architecture & Technical Decisions

- **Validation:** Server-side validation is enforced using Laravel's Form Requests/Validator.
- **Database:** Eloquent ORM is used to prevent SQL injection. Mass assignment protection is configured on the Student model.
- **CORS:** Configured in Laravel to allow communication with the Vite React frontend.

## Creating the Frontend (If Not Yet Created)

1. Open a new terminal in your main assignment folder (one level above the `backend` folder).

2. Generate the React application:

   ```bash
   npm create vite@latest frontend -- --template react
   ```

3. Navigate into the frontend folder and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

---

**Development:** Run the Laravel backend and React frontend in separate terminals simultaneously.