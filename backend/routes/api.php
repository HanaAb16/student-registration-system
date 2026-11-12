<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// ==========================================
// 1. Public Authentication Route
// ==========================================
Route::post('/login', [AuthController::class, 'login']);

// ==========================================
// 2. Protected Routes (Requires auth:sanctum)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // 1. Static and custom endpoints MUST precede parameterized routes (/{student})
    Route::get('/dashboard-stats', [StudentController::class, 'dashboardStats']);
    Route::get('/students/export', [StudentController::class, 'exportCsv']);
    Route::get('/students/trashed', [StudentController::class, 'trashed'])->middleware('role:admin');
    Route::post('/students/{id}/restore', [StudentController::class, 'restore'])->middleware('role:admin');

    // 2. Standard Read routes
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/students/{student}', [StudentController::class, 'show']);

    // 3. Admin-Only Mutation Routes (Requires role:admin)
    Route::middleware('role:admin')->group(function () {
        Route::post('/students', [StudentController::class, 'store']);
        Route::put('/students/{student}', [StudentController::class, 'update']);
        Route::delete('/students/{student}', [StudentController::class, 'destroy']);
    });
});
