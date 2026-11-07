<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('students', function (Blueprint $table) {
        $table->id(); // Auto-incrementing primary key
        
        // Required fields
        $table->string('registration_number')->unique();
        $table->string('first_name');
        $table->string('last_name');
        $table->enum('gender', ['Female', 'Male', 'Prefer not to say']);
        $table->date('date_of_birth');
        $table->string('email')->unique();
        $table->string('phone_number');
        $table->string('department');
        $table->string('academic_level'); // e.g., "Year 1"
        $table->date('enrollment_date');
        $table->enum('status', ['Active', 'Deferred', 'Graduated'])->default('Active');
        
        // Optional fields
        $table->text('address')->nullable(); // nullable() makes it optional

        $table->timestamps(); // Automatically creates 'created_at' and 'updated_at'
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
