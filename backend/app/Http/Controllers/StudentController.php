<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming data from the user
        // Enforces rules from section 4.1 Student information
        $validatedData = $request->validate([
            'registration_number' => 'required|string|max:50|unique:students,registration_number',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:Female,Male,Prefer not to say',
            'date_of_birth' => 'required|date|before:today',
            'email' => 'required|email|max:255|unique:students,email',
            'phone_number' => ['required', 'string', 'min:7', 'max:20', 'regex:/^[0-9+\s\-().]+$/'],
            'department' => 'required|string|max:255',
            'academic_level' => 'required|string|max:50',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:Active,Deferred,Graduated',
            'address' => 'nullable|string|max:1000',
        ], [
            'date_of_birth.before' => 'Date of birth must be a date in the past (cannot be today or in the future).',
            'date_of_birth.required' => 'Date of birth is required.',
            'date_of_birth.date' => 'Please provide a valid date of birth.',
            'phone_number.regex' => 'Phone number format is invalid. Use digits, spaces, hyphens, or a + prefix.',
            'phone_number.min' => 'Phone number must be at least 7 digits/characters.',
            'registration_number.unique' => 'This registration number is already in use.',
            'registration_number.required' => 'Registration number is required.',
            'email.unique' => 'This email address is already registered to another student.',
            'email.email' => 'Please enter a valid email address.',
            'gender.in' => 'Gender must be Female, Male, or Prefer not to say.',
            'status.in' => 'Status must be Active, Deferred, or Graduated.',
        ]);

        $student = Student::create($validatedData);
        return response()->json($student, 201);
    }

    // 1. READ ALL (GET /api/students)
    public function index(Request $request)
    {
        $query = Student::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('registration_number', 'like', "%{$search}%");
            });
        }

        $students = $query->orderBy('created_at', 'desc')->get();
        return response()->json($students, 200);
    }

    // 2. READ ONE (GET /api/students/{id})
    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json($student, 200);
    }

    // 3. UPDATE (PUT /api/students/{id})
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validatedData = $request->validate([
            'registration_number' => 'required|string|max:50|unique:students,registration_number,' . $id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:Female,Male,Prefer not to say',
            'date_of_birth' => 'required|date|before:today',
            'email' => 'required|email|max:255|unique:students,email,' . $id,
            'phone_number' => ['required', 'string', 'min:7', 'max:20', 'regex:/^[0-9+\s\-().]+$/'],
            'department' => 'required|string|max:255',
            'academic_level' => 'required|string|max:50',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:Active,Deferred,Graduated',
            'address' => 'nullable|string|max:1000',
        ], [
            'date_of_birth.before' => 'Date of birth must be a date in the past (cannot be today or in the future).',
            'date_of_birth.required' => 'Date of birth is required.',
            'date_of_birth.date' => 'Please provide a valid date of birth.',
            'phone_number.regex' => 'Phone number format is invalid. Use digits, spaces, hyphens, or a + prefix.',
            'phone_number.min' => 'Phone number must be at least 7 digits/characters.',
            'registration_number.unique' => 'This registration number is already in use.',
            'registration_number.required' => 'Registration number is required.',
            'email.unique' => 'This email address is already registered to another student.',
            'email.email' => 'Please enter a valid email address.',
            'gender.in' => 'Gender must be Female, Male, or Prefer not to say.',
            'status.in' => 'Status must be Active, Deferred, or Graduated.',
        ]);

        $student->update($validatedData);
        return response()->json($student, 200);
    }

    // 4. DELETE (DELETE /api/students/{id})
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(null, 204); 
    }
}
