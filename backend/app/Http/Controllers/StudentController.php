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
        // 2. Validate the incoming data from the user
        // This enforces the business rules from your assignment PDF
        $validatedData = $request->validate([
            'registration_number' => 'required|string|unique:students,registration_number',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'gender' => 'required|in:Female,Male,Prefer not to say',
            'date_of_birth' => 'required|date|before:today',
            'phone_number' => 'required|string|max:20',
            'department' => 'required|string',
            'academic_level' => 'required|string',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:Active,Deferred,Graduated',
        ]);

        // 3. Save the data to the database using the Model
        $student = Student::create($validatedData);

        // 4. Return the newly created student and a "201 Created" success code
        return response()->json($student, 201);
    }

    // 1. READ ALL (GET /api/students)
    public function index()
    {
        // Fetch all students from the database
        $students = Student::all();
        return response()->json($students, 200);
    }

    // 2. READ ONE (GET /api/students/{id})
    public function show($id)
    {
        // findOrFail automatically returns a 404 error if the ID doesn't exist
        $student = Student::findOrFail($id);
        return response()->json($student, 200);
    }

    // 3. UPDATE (PUT /api/students/{id})
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validatedData = $request->validate([
            // We append .$id to the unique rule so the student can keep their own existing email/ID
            'registration_number' => 'required|string|unique:students,registration_number,' . $id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $id,
            'gender' => 'required|in:Female,Male,Prefer not to say',
            'date_of_birth' => 'required|date|before:today',
            'phone_number' => 'required|string|max:20',
            'department' => 'required|string',
            'academic_level' => 'required|string',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:Active,Deferred,Graduated',
        ]);

        $student->update($validatedData);
        return response()->json($student, 200);
    }

    // 4. DELETE (DELETE /api/students/{id})
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        
        // 204 means "No Content" (the action was successful, but there is no data to return)
        return response()->json(null, 204); 
    }
}