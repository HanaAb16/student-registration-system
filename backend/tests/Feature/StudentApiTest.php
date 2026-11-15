<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 1: Unauthenticated requests return 401 Unauthorized.
     */
    public function test_unauthenticated_users_cannot_access_students_list(): void
    {
        $response = $this->getJson('/api/students');

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Unauthenticated.'
                 ]);
    }

    /**
     * Test 2: Authenticated users can fetch the list of students.
     */
    public function test_authenticated_users_can_fetch_students(): void
    {
        $user = User::factory()->create(['role' => 'viewer']);
        Student::create([
            'registration_number' => 'STU-1001',
            'first_name' => 'Alice',
            'last_name' => 'Johnson',
            'gender' => 'Female',
            'date_of_birth' => '2001-05-15',
            'email' => 'alice@example.com',
            'phone_number' => '+1234567890',
            'department' => 'Computer Science',
            'academic_level' => 'Year 2',
            'enrollment_date' => '2023-09-01',
            'status' => 'Active',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/students');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'current_page',
                     'data' => [
                         '*' => [
                             'id',
                             'registration_number',
                             'first_name',
                             'last_name',
                             'email',
                             'department',
                             'status',
                         ]
                     ],
                     'from',
                     'last_page',
                     'per_page',
                     'total',
                 ])
                 ->assertJsonCount(1, 'data')
                 ->assertJsonFragment([
                     'registration_number' => 'STU-1001',
                     'first_name' => 'Alice',
                 ]);
    }

    /**
     * Test 2b: Authenticated users can filter by status and search by name, email, or registration number.
     */
    public function test_authenticated_users_can_search_and_filter_students(): void
    {
        $user = User::factory()->create(['role' => 'viewer']);

        Student::create([
            'registration_number' => 'STU-101',
            'first_name' => 'Bob',
            'last_name' => 'Builder',
            'gender' => 'Male',
            'date_of_birth' => '2000-01-01',
            'email' => 'bob@example.com',
            'phone_number' => '+1555123456',
            'department' => 'Civil Engineering',
            'academic_level' => 'Year 3',
            'enrollment_date' => '2022-09-01',
            'status' => 'Active',
        ]);

        Student::create([
            'registration_number' => 'STU-102',
            'first_name' => 'Charlie',
            'last_name' => 'Chaplin',
            'gender' => 'Male',
            'date_of_birth' => '1999-04-16',
            'email' => 'charlie@example.com',
            'phone_number' => '+1555654321',
            'department' => 'Drama',
            'academic_level' => 'Year 4',
            'enrollment_date' => '2021-09-01',
            'status' => 'Graduated',
        ]);

        // Filter by status=Graduated using 'filter' parameter
        $filterResponse = $this->actingAs($user, 'sanctum')->getJson('/api/students?filter=Graduated');
        $filterResponse->assertStatus(200)
                       ->assertJsonCount(1, 'data')
                       ->assertJsonFragment(['first_name' => 'Charlie']);

        // Search by registration number
        $searchResponse = $this->actingAs($user, 'sanctum')->getJson('/api/students?search=STU-101');
        $searchResponse->assertStatus(200)
                       ->assertJsonCount(1, 'data')
                       ->assertJsonFragment(['first_name' => 'Bob']);

        // Search by email
        $emailSearchResponse = $this->actingAs($user, 'sanctum')->getJson('/api/students?search=charlie@example.com');
        $emailSearchResponse->assertStatus(200)
                            ->assertJsonCount(1, 'data')
                            ->assertJsonFragment(['registration_number' => 'STU-102']);
    }

    /**
     * Test 3: Admins can register a new student (201 Created).
     */
    public function test_admin_can_create_a_student(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $payload = [
            'registration_number' => 'STU-2002',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'gender' => 'Male',
            'date_of_birth' => '2000-01-10',
            'email' => 'john.doe@example.com',
            'phone_number' => '+1987654321',
            'department' => 'Software Engineering',
            'academic_level' => 'Year 1',
            'enrollment_date' => '2024-01-15',
            'status' => 'Active',
            'address' => '123 Campus Way',
        ];

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/students', $payload);

        $response->assertStatus(201)
                 ->assertJsonFragment([
                     'registration_number' => 'STU-2002',
                     'email' => 'john.doe@example.com',
                 ]);

        $this->assertDatabaseHas('students', [
            'registration_number' => 'STU-2002',
            'email' => 'john.doe@example.com',
        ]);
    }

    /**
     * Test 4: Viewers are forbidden from creating a student (403 Forbidden).
     */
    public function test_viewer_is_forbidden_from_creating_a_student(): void
    {
        $viewer = User::factory()->create(['role' => 'viewer']);

        $payload = [
            'registration_number' => 'STU-3003',
            'first_name' => 'Bob',
            'last_name' => 'Smith',
            'gender' => 'Male',
            'date_of_birth' => '1999-11-20',
            'email' => 'bob@example.com',
            'phone_number' => '+1122334455',
            'department' => 'Information Technology',
            'academic_level' => 'Year 3',
            'enrollment_date' => '2022-09-01',
            'status' => 'Active',
        ];

        $response = $this->actingAs($viewer, 'sanctum')->postJson('/api/students', $payload);

        $response->assertStatus(403);

        $this->assertDatabaseMissing('students', [
            'registration_number' => 'STU-3003',
        ]);
    }

    /**
     * Test 5: Validation errors return 422 Unprocessable Entity.
     */
    public function test_student_creation_requires_mandatory_fields(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/students', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([
                     'registration_number',
                     'first_name',
                     'last_name',
                     'email',
                     'status'
                 ]);
    }

    /**
     * Test 6: Authenticated users can stream CSV export.
     */
    public function test_authenticated_users_can_export_csv(): void
    {
        $user = User::factory()->create(['role' => 'viewer']);
        Student::create([
            'registration_number' => 'STU-CSV-1',
            'first_name' => 'Daisy',
            'last_name' => 'Duck',
            'gender' => 'Female',
            'date_of_birth' => '2001-02-02',
            'email' => 'daisy@example.com',
            'phone_number' => '+1555999888',
            'department' => 'Art',
            'academic_level' => 'Year 1',
            'enrollment_date' => '2023-09-01',
            'status' => 'Active',
        ]);

        $response = $this->actingAs($user, 'sanctum')->get('/api/students/export');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $this->assertStringContainsString('Registration Number', $response->streamedContent());
        $this->assertStringContainsString('STU-CSV-1', $response->streamedContent());
        $this->assertStringContainsString('daisy@example.com', $response->streamedContent());
    }

    /**
     * Test 7: Export CSV works with token query parameter (browser direct link fallback).
     */
    public function test_export_csv_authenticates_with_query_token(): void
    {
        $user = User::factory()->create(['role' => 'viewer']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->get('/api/students/export?token=' . $token);

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    }

    /**
     * Test 8: Student self-registration creates Student and User account with role 'student'.
     */
    public function test_students_can_self_register_and_receive_token(): void
    {
        $payload = [
            'first_name' => 'Emma',
            'last_name' => 'Watson',
            'gender' => 'Female',
            'date_of_birth' => '2002-04-15',
            'email' => 'emma.watson@student.edu',
            'password' => 'secret123',
            'phone_number' => '+1555123987',
            'department' => 'Software Engineering',
            'academic_level' => 'Year 1',
            'address' => '456 College Ave',
        ];

        $response = $this->postJson('/api/register-student', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'access_token',
                     'token_type',
                     'user' => ['id', 'name', 'email', 'role'],
                     'student' => ['id', 'registration_number', 'email', 'department'],
                 ])
                 ->assertJsonFragment([
                     'email' => 'emma.watson@student.edu',
                     'role' => 'student',
                 ]);

        $this->assertDatabaseHas('students', [
            'email' => 'emma.watson@student.edu',
            'department' => 'Software Engineering',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'emma.watson@student.edu',
            'role' => 'student',
        ]);
    }

    /**
     * Test 9: Authenticated student can view their own profile.
     */
    public function test_authenticated_student_can_fetch_own_profile(): void
    {
        $user = User::factory()->create([
            'email' => 'student.test@example.com',
            'role' => 'student'
        ]);

        Student::create([
            'registration_number' => 'STU-SELF-01',
            'first_name' => 'Test',
            'last_name' => 'Student',
            'gender' => 'Male',
            'date_of_birth' => '2001-01-01',
            'email' => 'student.test@example.com',
            'phone_number' => '+1555000111',
            'department' => 'Computer Science',
            'academic_level' => 'Year 2',
            'enrollment_date' => '2023-09-01',
            'status' => 'Active',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/my-profile');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'registration_number' => 'STU-SELF-01',
                     'email' => 'student.test@example.com',
                     'department' => 'Computer Science',
                 ]);
    }

    /**
     * Test 10: Authenticated student can update their contact info.
     */
    public function test_authenticated_student_can_update_contact_info(): void
    {
        $user = User::factory()->create([
            'email' => 'student.update@example.com',
            'role' => 'student'
        ]);

        Student::create([
            'registration_number' => 'STU-SELF-02',
            'first_name' => 'Update',
            'last_name' => 'Student',
            'gender' => 'Female',
            'date_of_birth' => '2001-01-01',
            'email' => 'student.update@example.com',
            'phone_number' => '+1555000222',
            'department' => 'Information Technology',
            'academic_level' => 'Year 1',
            'enrollment_date' => '2024-01-01',
            'status' => 'Active',
            'address' => 'Old Address',
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/my-profile', [
            'phone_number' => '+1555999000',
            'address' => 'New Dormitory 12B',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'phone_number' => '+1555999000',
                     'address' => 'New Dormitory 12B',
                 ]);

        $this->assertDatabaseHas('students', [
            'email' => 'student.update@example.com',
            'phone_number' => '+1555999000',
            'address' => 'New Dormitory 12B',
        ]);
    }
}
