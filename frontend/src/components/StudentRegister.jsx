import { useState } from 'react';
import { registerStudent } from '../services/api';

export default function StudentRegister({ onRegisterSuccess, onNavigate }) {
    const todayString = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        gender: 'Female',
        date_of_birth: '',
        phone_number: '',
        department: 'Computer Science',
        academic_level: 'Year 1',
        address: '',
    });

    const [clientErrors, setClientErrors] = useState({});
    const [backendErrors, setBackendErrors] = useState(null);
    const [generalError, setGeneralError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (clientErrors[name]) {
            setClientErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const validate = () => {
        const errors = {};

        if (!formData.first_name.trim()) errors.first_name = 'First name is required.';
        if (!formData.last_name.trim()) errors.last_name = 'Last name is required.';
        if (!formData.email.trim()) errors.email = 'Email address is required.';
        if (!formData.password) {
            errors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        if (formData.password !== formData.confirm_password) {
            errors.confirm_password = 'Passwords do not match.';
        }

        if (!formData.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required.';
        } else if (formData.date_of_birth >= todayString) {
            errors.date_of_birth = 'Date of birth must be a past date.';
        }

        if (!formData.phone_number.trim()) {
            errors.phone_number = 'Phone number is required.';
        } else if (!/^[0-9+\s\-().]+$/.test(formData.phone_number.trim())) {
            errors.phone_number = 'Invalid phone number format.';
        }

        if (!formData.department) errors.department = 'Department is required.';
        if (!formData.academic_level) errors.academic_level = 'Academic level is required.';

        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(null);
        setBackendErrors(null);

        if (!validate()) return;

        setIsLoading(true);
        try {
            const data = await registerStudent(formData);
            if (onRegisterSuccess) {
                onRegisterSuccess(data.user);
            }
        } catch (err) {
            if (err.validationErrors) {
                setBackendErrors(err.validationErrors);
            } else {
                setGeneralError(err.message || 'Registration failed. Please check your inputs.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getFieldError = (field) => {
        if (clientErrors[field]) return clientErrors[field];
        if (backendErrors && backendErrors[field]) {
            return Array.isArray(backendErrors[field]) ? backendErrors[field][0] : backendErrors[field];
        }
        return null;
    };

    return (
        <div style={{ maxWidth: '720px', margin: '24px auto', padding: '0 20px' }}>
            <div className="card" style={{ padding: '36px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <button
                            type="button"
                            onClick={() => onNavigate('home')}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8125rem', marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                            ← Back to Home
                        </button>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Student Self-Registration
                        </h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Create your student profile and academic account in minutes
                        </p>
                    </div>

                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                    }}>
                        🎓
                    </div>
                </div>

                {generalError && (
                    <div className="alert-error" role="alert" style={{ marginBottom: '20px' }}>
                        <strong>Error: </strong>{generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Section 1: Account & Credentials */}
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '6px', marginBottom: '16px' }}>
                        1. Account Credentials
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="first_name">
                                First Name <span className="form-label-required">*</span>
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                className={`form-control ${getFieldError('first_name') ? 'has-error' : ''}`}
                                placeholder="e.g. Sarah"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('first_name') && (
                                <span className="field-error-text">{getFieldError('first_name')}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="last_name">
                                Last Name <span className="form-label-required">*</span>
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                className={`form-control ${getFieldError('last_name') ? 'has-error' : ''}`}
                                placeholder="e.g. Jenkins"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('last_name') && (
                                <span className="field-error-text">{getFieldError('last_name')}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label" htmlFor="email">
                            Email Address (Used for Sign In) <span className="form-label-required">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className={`form-control ${getFieldError('email') ? 'has-error' : ''}`}
                            placeholder="e.g. sarah.jenkins@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {getFieldError('email') && (
                            <span className="field-error-text">{getFieldError('email')}</span>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Create Password <span className="form-label-required">*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={`form-control ${getFieldError('password') ? 'has-error' : ''}`}
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('password') && (
                                <span className="field-error-text">{getFieldError('password')}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirm_password">
                                Confirm Password <span className="form-label-required">*</span>
                            </label>
                            <input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                className={`form-control ${getFieldError('confirm_password') ? 'has-error' : ''}`}
                                placeholder="Re-enter password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('confirm_password') && (
                                <span className="field-error-text">{getFieldError('confirm_password')}</span>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Academic Program */}
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '6px', marginBottom: '16px' }}>
                        2. Academic Program
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="department">
                                Department / Major <span className="form-label-required">*</span>
                            </label>
                            <select
                                id="department"
                                name="department"
                                className={`form-control ${getFieldError('department') ? 'has-error' : ''}`}
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Software Engineering">Software Engineering</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Business Administration">Business Administration</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Data Science">Data Science</option>
                            </select>
                            {getFieldError('department') && (
                                <span className="field-error-text">{getFieldError('department')}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="academic_level">
                                Academic Level <span className="form-label-required">*</span>
                            </label>
                            <select
                                id="academic_level"
                                name="academic_level"
                                className={`form-control ${getFieldError('academic_level') ? 'has-error' : ''}`}
                                value={formData.academic_level}
                                onChange={handleChange}
                                required
                            >
                                <option value="Year 1">Year 1 (Freshman)</option>
                                <option value="Year 2">Year 2 (Sophomore)</option>
                                <option value="Year 3">Year 3 (Junior)</option>
                                <option value="Year 4">Year 4 (Senior)</option>
                                <option value="Postgraduate">Postgraduate</option>
                            </select>
                            {getFieldError('academic_level') && (
                                <span className="field-error-text">{getFieldError('academic_level')}</span>
                            )}
                        </div>
                    </div>

                    {/* Section 3: Personal & Contact Details */}
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '6px', marginBottom: '16px' }}>
                        3. Personal & Contact Information
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="gender">
                                Gender <span className="form-label-required">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className="form-control"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="date_of_birth">
                                Date of Birth <span className="form-label-required">*</span>
                            </label>
                            <input
                                id="date_of_birth"
                                name="date_of_birth"
                                type="date"
                                max={todayString}
                                className={`form-control ${getFieldError('date_of_birth') ? 'has-error' : ''}`}
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('date_of_birth') && (
                                <span className="field-error-text">{getFieldError('date_of_birth')}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone_number">
                                Phone Number <span className="form-label-required">*</span>
                            </label>
                            <input
                                id="phone_number"
                                name="phone_number"
                                type="text"
                                className={`form-control ${getFieldError('phone_number') ? 'has-error' : ''}`}
                                placeholder="e.g. +1 555-0199"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                            {getFieldError('phone_number') && (
                                <span className="field-error-text">{getFieldError('phone_number')}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label" htmlFor="address">
                            Residential Address (Optional)
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            rows={2}
                            className="form-control"
                            placeholder="e.g. 124 Campus Hall, University Campus"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Actions */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 600, justifyContent: 'center' }}
                    >
                        {isLoading ? 'Creating Student Account...' : 'Complete Registration & Enter Portal →'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Already registered as a student or staff member?{' '}
                        <button
                            type="button"
                            onClick={() => onNavigate('login')}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Sign In here
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
