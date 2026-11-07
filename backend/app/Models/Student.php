<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    // These are the only fields a user is allowed to submit through a form
    protected $fillable = [
        'registration_number',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'email',
        'phone_number',
        'department',
        'academic_level',
        'enrollment_date',
        'status',
        'address',
    ];
}