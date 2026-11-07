import { useState } from 'react';

export default function StudentForm({ onSubmit, onCancel, backendErrors }) {
    // Hold the input values in state
    const [formData, setFormData] = useState({
        registration_number: '',
        first_name: '',
        last_name: '',
        email: '',
        gender: 'Female', // Default value
        date_of_birth: '',
        phone_number: '',
        department: '',
        academic_level: '',
        enrollment_date: '',
        status: 'Active',
    });

    // Update state when user types
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h2>Register New Student</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                
                {/* Registration Number */}
                <div>
                    <label>Registration Number *</label><br />
                    <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    {backendErrors?.registration_number && <span style={{ color: 'red', fontSize: '0.8em' }}>{backendErrors.registration_number[0]}</span>}
                </div>

                {/* First Name */}
                <div>
                    <label>First Name *</label><br />
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    {backendErrors?.first_name && <span style={{ color: 'red', fontSize: '0.8em' }}>{backendErrors.first_name[0]}</span>}
                </div>

                {/* Last Name */}
                <div>
                    <label>Last Name *</label><br />
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>

                {/* Email */}
                <div>
                    <label>Email Address *</label><br />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    {backendErrors?.email && <span style={{ color: 'red', fontSize: '0.8em' }}>{backendErrors.email[0]}</span>}
                </div>

                {/* Gender */}
                <div>
                    <label>Gender *</label><br />
                    <select name="gender" value={formData.gender} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>

                {/* Date of Birth */}
                <div>
                    <label>Date of Birth *</label><br />
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>

                {/* Phone Number */}
                <div>
                    <label>Phone Number *</label><br />
                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>

                {/* Department */}
                <div>
                    <label>Department *</label><br />
                    <input type="text" name="department" value={formData.department} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>

                {/* Academic Level */}
                <div>
                    <label>Academic Level (e.g., Year 1) *</label><br />
                    <input type="text" name="academic_level" value={formData.academic_level} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>

                {/* Enrollment Date */}
                <div>
                    <label>Enrollment Date *</label><br />
                    <input type="date" name="enrollment_date" value={formData.enrollment_date} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>

                {/* Buttons (span across both columns) */}
                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                        Save Student
                    </button>
                    <button type="button" onClick={onCancel} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}