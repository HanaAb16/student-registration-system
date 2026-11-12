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
        // withTrashed() allows viewing student details even if soft-deleted in recycle bin
        $student = Student::withTrashed()->findOrFail($id);
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
    /**
     * Fetch only the soft-deleted students.
     */
    public function trashed()
    {
        // onlyTrashed() is a special query modifier provided by the SoftDeletes trait
        $trashedStudents = Student::onlyTrashed()->get();
        return response()->json($trashedStudents, 200);
    }

    /**
     * Restore a specific soft-deleted student.
     */
    public function restore($id)
    {
        // withTrashed() finds the student even if already restored or in transition
        $student = Student::withTrashed()->findOrFail($id);
        
        if ($student->trashed()) {
            $student->restore();
        }
        
        return response()->json([
            'message' => 'Student restored successfully',
            'student' => $student
        ], 200);
    }

    /**
     * Compute aggregated dashboard metrics directly in the database.
     * GET /api/dashboard-stats
     */
    public function dashboardStats()
    {
        // 1. Scalar aggregation: Total registered active students
        $totalStudents = Student::count();

        // 2. Grouped aggregation: Student count per status
        // selectRaw() allows count(*) while groupBy buckets them into categories
        $statusCounts = Student::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        // 3. Grouped aggregation: Student count per department (sorted highest to lowest)
        $departmentCounts = Student::selectRaw('department, count(*) as total')
            ->groupBy('department')
            ->orderBy('total', 'desc')
            ->get();

        // 4. Soft-delete aggregation: Total records currently in recycle bin
        $trashedCount = Student::onlyTrashed()->count();

        return response()->json([
            'total_students' => $totalStudents,
            'status_counts' => [
                'Active' => (int) ($statusCounts['Active'] ?? 0),
                'Deferred' => (int) ($statusCounts['Deferred'] ?? 0),
                'Graduated' => (int) ($statusCounts['Graduated'] ?? 0),
            ],
            'department_counts' => $departmentCounts,
            'trashed_count' => $trashedCount,
        ], 200);
    }

    /**
     * Stream active student records as a downloadable CSV file.
     * GET /api/students/export
     */
    public function exportCsv(Request $request)
    {
        $fileName = 'students_export_' . date('Y-m-d_His') . '.csv';

        // HTTP Headers to instruct the browser to download the file directly
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        // StreamedResponse executes callback row-by-row without loading full dataset into memory
        return response()->stream(function () use ($request) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM so Excel properly renders special characters
            fputs($handle, "\xEF\xBB\xBF");

            // 1. Write Header Row
            fputcsv($handle, [
                'ID',
                'Registration Number',
                'First Name',
                'Last Name',
                'Gender',
                'Date of Birth',
                'Email',
                'Phone Number',
                'Department',
                'Academic Level',
                'Enrollment Date',
                'Status',
                'Address',
                'Created At',
            ]);

            // 2. Query active students (optionally respecting active filters)
            $query = Student::query();

            if ($request->filled('status') && $request->status !== 'ALL') {
                $query->where('status', $request->status);
            }
            if ($request->filled('department') && $request->department !== 'ALL') {
                $query->where('department', $request->department);
            }

            // 3. cursor() yields 1 row at a time using PDO generators (O(1) RAM usage)
            foreach ($query->orderBy('created_at', 'desc')->cursor() as $student) {
                fputcsv($handle, [
                    $student->id,
                    $student->registration_number,
                    $student->first_name,
                    $student->last_name,
                    $student->gender,
                    $student->date_of_birth,
                    $student->email,
                    $student->phone_number,
                    $student->department,
                    $student->academic_level,
                    $student->enrollment_date,
                    $student->status,
                    $student->address ?? 'N/A',
                    $student->created_at ? $student->created_at->toDateTimeString() : '',
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}
