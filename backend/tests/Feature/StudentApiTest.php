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
                 ->assertJsonCount(1)
                 ->assertJsonFragment([
                     'registration_number' => 'STU-1001',
                     'first_name' => 'Alice',
                 ]);
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
}
