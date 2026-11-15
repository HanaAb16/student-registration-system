<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Public self-registration for new students.
     * POST /api/register-student
     */
    public function registerStudent(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:Female,Male,Prefer not to say',
            'date_of_birth' => 'required|date|before:today',
            'email' => 'required|email|max:255|unique:students,email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone_number' => ['required', 'string', 'min:7', 'max:20', 'regex:/^[0-9+\s\-().]+$/'],
            'department' => 'required|string|max:255',
            'academic_level' => 'required|string|max:50',
            'address' => 'nullable|string|max:1000',
            'registration_number' => 'nullable|string|max:50|unique:students,registration_number',
        ], [
            'date_of_birth.before' => 'Date of birth must be a date in the past.',
            'email.unique' => 'This email address is already registered. Please sign in or use a different email.',
            'phone_number.regex' => 'Phone number format is invalid. Use digits, spaces, hyphens, or a + prefix.',
            'phone_number.min' => 'Phone number must be at least 7 digits.',
            'password.min' => 'Password must be at least 6 characters.',
        ]);

        return DB::transaction(function () use ($validatedData) {
            // Auto-generate unique registration number if not explicitly provided
            $regNo = !empty($validatedData['registration_number'])
                ? $validatedData['registration_number']
                : 'STU-' . date('Y') . '-' . str_pad((string) mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);

            // Ensure registration number is unique
            while (Student::where('registration_number', $regNo)->exists()) {
                $regNo = 'STU-' . date('Y') . '-' . str_pad((string) mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
            }

            // 1. Create Student record
            $student = Student::create([
                'registration_number' => $regNo,
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'gender' => $validatedData['gender'],
                'date_of_birth' => $validatedData['date_of_birth'],
                'email' => $validatedData['email'],
                'phone_number' => $validatedData['phone_number'],
                'department' => $validatedData['department'],
                'academic_level' => $validatedData['academic_level'],
                'enrollment_date' => now()->toDateString(),
                'status' => 'Active',
                'address' => $validatedData['address'] ?? null,
            ]);

            // 2. Create User account with role 'student'
            $user = User::create([
                'name' => "{$validatedData['first_name']} {$validatedData['last_name']}",
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => 'student',
            ]);

            // 3. Generate Sanctum Bearer token for immediate authenticated session
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Student registered successfully',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'student' => $student,
            ], 201);
        });
    }
    /**
     * Authenticate user credentials and issue a Laravel Sanctum Bearer token.
     * POST /api/login
     */
    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validatedData['email'])->first();

        // Timing-safe password verification
        if (!$user || !Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Issue Sanctum Personal Access Token (SHA-256 hash stored in DB, plain-text returned)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 200);
    }

    /**
     * Revoke the current access token.
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Delete current token record from personal_access_tokens
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Fetch authenticated user information.
     * GET /api/me
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ], 200);
    }
}
