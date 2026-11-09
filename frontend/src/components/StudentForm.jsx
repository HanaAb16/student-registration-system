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

    const [clientErrors, setClientErrors] = useState({});

    // Max allowable date for Date of Birth is yesterday / today (must not be in the future)
    const todayString = new Date().toISOString().split('T')[0];

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

    // Update state when user types and clear the specific field error
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (clientErrors[name]) {
            setClientErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    // Combined errors from client-side validation and backend response
    const combinedErrors = {
        ...clientErrors,
        ...(backendErrors || {}),
    };

    const validateForm = () => {
        const errors = {};

        // 1. Registration Number: Required; unique (enforced by backend)
        if (!formData.registration_number || !formData.registration_number.trim()) {
            errors.registration_number = ['Registration number is required.'];
        }

        // 2. First Name: Required; text
        if (!formData.first_name || !formData.first_name.trim()) {
            errors.first_name = ['First name is required.'];
        }

        // 3. Last Name: Required; text
        if (!formData.last_name || !formData.last_name.trim()) {
            errors.last_name = ['Last name is required.'];
        }

        // 4. Gender: Required; selectable Female, Male, Prefer not to say
        if (!formData.gender || !['Female', 'Male', 'Prefer not to say'].includes(formData.gender)) {
            errors.gender = ['Please select a valid gender (Female, Male, or Prefer not to say).'];
        }

        // 5. Date of Birth: Required; valid date and NOT in the future
        if (!formData.date_of_birth) {
            errors.date_of_birth = ['Date of birth is required.'];
        } else {
            const dob = new Date(formData.date_of_birth);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (isNaN(dob.getTime())) {
                errors.date_of_birth = ['Please provide a valid date of birth.'];
            } else if (dob >= today) {
                errors.date_of_birth = ['Date of birth must be a date in the past (cannot be today or in the future).'];
            }
        }

        // 6. Email: Required; valid email format; unique
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !formData.email.trim()) {
            errors.email = ['Email address is required.'];
        } else if (!emailRegex.test(formData.email.trim())) {
            errors.email = ['Please enter a valid email address (e.g. name@example.com).'];
        }

        // 7. Phone Number: Required; sensible length and format validation
        const phoneRegex = /^[0-9+\s\-().]+$/;
        const cleanedPhone = (formData.phone_number || '').trim();
        if (!cleanedPhone) {
            errors.phone_number = ['Phone number is required.'];
        } else if (cleanedPhone.length < 7 || cleanedPhone.length > 20) {
            errors.phone_number = ['Phone number must be between 7 and 20 digits/characters.'];
        } else if (!phoneRegex.test(cleanedPhone)) {
            errors.phone_number = ['Phone number format is invalid. Use digits, spaces, hyphens, or a + prefix.'];
        }

        // 8. Department / Program: Required; text or selectable list
        if (!formData.department || !formData.department.trim()) {
            errors.department = ['Department / Program is required.'];
        }

        // 9. Academic Level: Required; e.g., Year 1–6 or equivalent
        if (!formData.academic_level || !formData.academic_level.trim()) {
            errors.academic_level = ['Year / Academic Level is required (e.g., Year 1).'];
        }

        // 10. Enrollment Date: Required; valid date
        if (!formData.enrollment_date) {
            errors.enrollment_date = ['Enrollment date is required.'];
        } else {
            const enrollDate = new Date(formData.enrollment_date);
            if (isNaN(enrollDate.getTime())) {
                errors.enrollment_date = ['Please provide a valid enrollment date.'];
            }
        }

        // 11. Status: Required; Active, Deferred, or Graduated
        if (!formData.status || !['Active', 'Deferred', 'Graduated'].includes(formData.status)) {
            errors.status = ['Status must be Active, Deferred, or Graduated.'];
        }

        return errors;
    };

    // Helper to get first error text for a field
    const getFieldError = (fieldName) => {
        const err = combinedErrors[fieldName];
        if (!err) return null;
        return Array.isArray(err) ? err[0] : String(err);
    };

    // Handle the form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setClientErrors(errors);
            // Scroll to the top of the form so user sees the error summary
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setClientErrors({});
        onSubmit(formData);
    };

    const hasAnyErrors = Object.keys(combinedErrors).length > 0;

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
            
            <form onSubmit={handleSubmit} className="form-body" noValidate>
                {/* Form Error Banner Summary */}
                {hasAnyErrors && (
                    <div className="alert-error" style={{ marginBottom: '24px' }} role="alert">
                        <svg className="alert-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <div style={{ flex: 1 }}>
                            <strong>Validation Error: Please review the following required fields:</strong>
                            <ul style={{ margin: '6px 0 0', paddingLeft: '20px', fontSize: '0.8125rem' }}>
                                {Object.entries(combinedErrors).map(([field, msgs]) => (
                                    <li key={field}>
                                        {Array.isArray(msgs) ? msgs[0] : msgs}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="form-grid">
                    {/* 1. Registration Number */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="registration_number">
                            Student ID / Registration Number <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="registration_number"
                            type="text" 
                            name="registration_number" 
                            placeholder="e.g. REG-2024-001"
                            value={formData.registration_number} 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${getFieldError('registration_number') ? 'has-error' : ''}`}
                        />
                        {getFieldError('registration_number') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('registration_number')}
                            </span>
                        )}
                    </div>

                    {/* 2. First Name */}
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
                            className={`form-control ${getFieldError('first_name') ? 'has-error' : ''}`}
                        />
                        {getFieldError('first_name') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('first_name')}
                            </span>
                        )}
                    </div>

                    {/* 3. Last Name */}
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
                            className={`form-control ${getFieldError('last_name') ? 'has-error' : ''}`}
                        />
                        {getFieldError('last_name') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('last_name')}
                            </span>
                        )}
                    </div>

                    {/* 4. Gender */}
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
                            className={`form-control ${getFieldError('gender') ? 'has-error' : ''}`}
                        >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        {getFieldError('gender') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('gender')}
                            </span>
                        )}
                    </div>

                    {/* 5. Date of Birth (Not in the future) */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="date_of_birth">
                            Date of Birth (Must be in the past) <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="date_of_birth"
                            type="date" 
                            name="date_of_birth" 
                            max={todayString}
                            value={formData.date_of_birth} 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${getFieldError('date_of_birth') ? 'has-error' : ''}`}
                        />
                        {getFieldError('date_of_birth') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('date_of_birth')}
                            </span>
                        )}
                    </div>

                    {/* 6. Email Address */}
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
                            className={`form-control ${getFieldError('email') ? 'has-error' : ''}`}
                        />
                        {getFieldError('email') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('email')}
                            </span>
                        )}
                    </div>

                    {/* 7. Phone Number */}
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
                            className={`form-control ${getFieldError('phone_number') ? 'has-error' : ''}`}
                        />
                        {getFieldError('phone_number') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('phone_number')}
                            </span>
                        )}
                    </div>

                    {/* 8. Department / Program */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="department">
                            Department / Program <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="department"
                            type="text" 
                            name="department" 
                            list="department-options"
                            placeholder="e.g. Computer Science"
                            value={formData.department} 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${getFieldError('department') ? 'has-error' : ''}`}
                        />
                        <datalist id="department-options">
                            <option value="Computer Science" />
                            <option value="Information Technology" />
                            <option value="Software Engineering" />
                            <option value="Electrical Engineering" />
                            <option value="Business Administration" />
                            <option value="Mechanical Engineering" />
                        </datalist>
                        {getFieldError('department') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('department')}
                            </span>
                        )}
                    </div>

                    {/* 9. Year / Academic Level */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="academic_level">
                            Year / Academic Level <span className="form-label-required">*</span>
                        </label>
                        <input 
                            id="academic_level"
                            type="text" 
                            name="academic_level" 
                            list="level-options"
                            placeholder="e.g. Year 1"
                            value={formData.academic_level} 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${getFieldError('academic_level') ? 'has-error' : ''}`}
                        />
                        <datalist id="level-options">
                            <option value="Year 1" />
                            <option value="Year 2" />
                            <option value="Year 3" />
                            <option value="Year 4" />
                            <option value="Year 5" />
                            <option value="Year 6" />
                        </datalist>
                        {getFieldError('academic_level') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('academic_level')}
                            </span>
                        )}
                    </div>

                    {/* 10. Enrollment Date */}
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
                            className={`form-control ${getFieldError('enrollment_date') ? 'has-error' : ''}`}
                        />
                        {getFieldError('enrollment_date') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('enrollment_date')}
                            </span>
                        )}
                    </div>

                    {/* 11. Status */}
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
                            className={`form-control ${getFieldError('status') ? 'has-error' : ''}`}
                        >
                            <option value="Active">Active</option>
                            <option value="Deferred">Deferred</option>
                            <option value="Graduated">Graduated</option>
                        </select>
                        {getFieldError('status') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('status')}
                            </span>
                        )}
                    </div>

                    {/* 12. Address (Optional) */}
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
                            className={`form-control ${getFieldError('address') ? 'has-error' : ''}`}
                        />
                        {getFieldError('address') && (
                            <span className="field-error-text">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                {getFieldError('address')}
                            </span>
                        )}
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
