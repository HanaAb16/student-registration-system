import { useState, useEffect } from 'react';

export default function StudentForm({ onSubmit, onCancel, backendErrors, initialData }) {
    const [formData, setFormData] = useState({
        registration_number: '',
        first_name: '',
        last_name: '',
        email: '',
        gender: 'Female',
        date_of_birth: '',
        phone_number: '',
        department: '',
        academic_level: '',
        enrollment_date: '',
        status: 'Active',
        address: '',
    });

    // If initialData is provided (meaning we clicked Edit), populate the form
    useEffect(() => {
        if (initialData) {
            setFormData({
                registration_number: initialData.registration_number || '',
                first_name: initialData.first_name || '',
                last_name: initialData.last_name || '',
                email: initialData.email || '',
                gender: initialData.gender || 'Female',
                date_of_birth: initialData.date_of_birth || '',
                phone_number: initialData.phone_number || '',
                department: initialData.department || '',
                academic_level: initialData.academic_level || '',
                enrollment_date: initialData.enrollment_date || '',
                status: initialData.status || 'Active',
                address: initialData.address || '',
            });
        }
    }, [initialData]);

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
        <div className="card">
            <div className="card-header">
                <div className="card-header-titles">
                    <h2>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                            {initialData ? (
                                <>
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </>
                            ) : (
                                <>
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7.5" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </>
                            )}
                        </svg>
                        {initialData ? 'Edit Student' : 'Register New Student'}
                    </h2>
                    <p>Enter the student's personal, contact, and academic details</p>
                </div>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px' }}
                    title="Close form"
                >
                    ✕ Close
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="form-body">
                <div className="form-grid">
                    {/* Registration Number */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="registration_number">
                            Registration Number <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="registration_number"
                            type="text" 
                            name="registration_number" 
                            placeholder="e.g. REG-2024-001"
                            value={formData.registration_number} 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${backendErrors?.registration_number ? 'has-error' : ''}`}
                        />
                        {backendErrors?.registration_number && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {backendErrors.registration_number[0]}
                            </span>
                        )}
                    </div>

                    {/* First Name */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="first_name">
                            First Name <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="first_name"
                            type="text" 
                            name="first_name" 
                            placeholder="e.g. Jane"
                            value={formData.first_name} 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${backendErrors?.first_name ? 'has-error' : ''}`}
                        />
                        {backendErrors?.first_name && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {backendErrors.first_name[0]}
                            </span>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="last_name">
                            Last Name <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="last_name"
                            type="text" 
                            name="last_name" 
                            placeholder="e.g. Doe"
                            value={formData.last_name} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email Address <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="email"
                            type="email" 
                            name="email" 
                            placeholder="e.g. jane.doe@university.edu"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${backendErrors?.email ? 'has-error' : ''}`}
                        />
                        {backendErrors?.email && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {backendErrors.email[0]}
                            </span>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="gender">
                            Gender <span className="form-label-required">*</span>
                        </label>
                        <select 
                            id="gender"
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="date_of_birth">
                            Date of Birth <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="date_of_birth"
                            type="date" 
                            name="date_of_birth" 
                            value={formData.date_of_birth} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="phone_number">
                            Phone Number <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="phone_number"
                            type="text" 
                            name="phone_number" 
                            placeholder="e.g. +1 555-0199"
                            value={formData.phone_number} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* Department */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="department">
                            Department <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="department"
                            type="text" 
                            name="department" 
                            placeholder="e.g. Computer Science"
                            value={formData.department} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* Academic Level */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="academic_level">
                            Academic Level (e.g., Year 1) <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="academic_level"
                            type="text" 
                            name="academic_level" 
                            placeholder="e.g. Year 1"
                            value={formData.academic_level} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* Enrollment Date */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="enrollment_date">
                            Enrollment Date <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="enrollment_date"
                            type="date" 
                            name="enrollment_date" 
                            value={formData.enrollment_date} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>

                    {/* Status (strictly matches backend enum: Active, Deferred, Graduated) */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="status">
                            Status <span className="form-label-required">*</span>
                        </label>
                        <select 
                            id="status"
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        >
                            <option value="Active">Active</option>
                            <option value="Deferred">Deferred</option>
                            <option value="Graduated">Graduated</option>
                        </select>
                    </div>

                    {/* Address (Optional) */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="address">
                            Address <span style={{ color: 'var(--text-light)', fontWeight: 'normal' }}>(Optional)</span>
                        </label>
                        <input 
                            id="address"
                            type="text" 
                            name="address" 
                            placeholder="e.g. 123 Campus Way, Apt 4B"
                            value={formData.address} 
                            onChange={handleChange} 
                            className="form-control"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="form-actions-bar">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save Student
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
