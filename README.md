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
| `POST` | `/api/login` | Authenticate user & issue Sanctum Bearer token | JSON (`email`, `password`) | `200 OK` (Token & User) |
| `POST` | `/api/logout` | Revoke active Sanctum token (Protected: `auth:sanctum`) | None | `200 OK` (Message) |
| `GET` | `/api/me` | Fetch active user profile (Protected: `auth:sanctum`) | None | `200 OK` (User object) |
| `GET` | `/api/dashboard-stats` | Fetch aggregated dashboard metrics (database-level) | None | `200 OK` (Object) |
| `GET` | `/api/students/export` | Stream active student records as a downloadable CSV | None | `200 OK` (CSV stream) |
| `GET` | `/api/students` | Fetch list of all active students (supports search & filter) | None | `200 OK` (Array) |
| `POST` | `/api/students` | Register a new student | JSON (All fields) | `201 Created` (Object) |
| `GET` | `/api/students/trashed` | Fetch soft-deleted students (Recycle Bin) | None | `200 OK` (Array) |
| `POST` | `/api/students/{id}/restore` | Restore a soft-deleted student | None | `200 OK` (Object) |
| `GET` | `/api/students/{id}` | View a single student | None | `200 OK` (Object) |
| `PUT` | `/api/students/{id}` | Update an existing student | JSON (All fields) | `200 OK` (Object) |
| `DELETE` | `/api/students/{id}` | Soft-delete a student (moves to Recycle Bin) | None | `204 No Content` |

**Error Handling:** Invalid requests to `POST` or `PUT` return a `422 Unprocessable Entity` status with JSON validation errors. Missing records return a `404 Not Found`.

## Architecture & Technical Decisions

- **Validation:** Server-side validation is enforced using Laravel's Form Requests/Validator.
- **Database:** Eloquent ORM is used to prevent SQL injection. Mass assignment protection is configured on the Student model.
- **Data Aggregation:** Dashboard metrics are computed at the database level (`count()`, `groupBy()`, `selectRaw()`) for optimal $O(1)$ network payload and performance.
- **Soft Deletes:** Implemented with Laravel's `SoftDeletes` trait, preserving data integrity and supporting a Recycle Bin with a restore action.
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

## Automated Testing

### Backend Feature Tests (PHPUnit)
The backend test suite runs against an isolated SQLite in-memory database using the `RefreshDatabase` trait:

```bash
cd backend
php vendor/phpunit/phpunit/phpunit tests/Feature/StudentApiTest.php
```

Tests cover:
- `401 Unauthorized` for unauthenticated requests
- `200 OK` for authenticated student listings
- `201 Created` with `assertDatabaseHas` for Admin registrations
- `403 Forbidden` with `assertDatabaseMissing` for Viewer mutations
- `422 Unprocessable Entity` for payload validation failures

### Frontend Component Tests (Vitest & React Testing Library)
The frontend test suite exercises component behavior and Virtual DOM interactions:

```bash
cd frontend
npm test
```

Tests cover:
- Accessible UI rendering (`getByRole`, `getByLabelText`)
- User interactions with `@testing-library/user-event`
- Quick-fill credential demo buttons

---

**Development:** Run the Laravel backend and React frontend in separate terminals simultaneously.