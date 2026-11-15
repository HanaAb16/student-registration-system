import { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile } from '../services/api';

export default function StudentPortal({ currentUser, onSignOut, onNavigate }) {
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit contact mode
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactForm, setContactForm] = useState({ phone_number: '', address: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        setIsLoading(true);
        setError(null);

        getMyProfile()
            .then((data) => {
                setStudent(data);
                setContactForm({
                    phone_number: data.phone_number || '',
                    address: data.address || ''
                });
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Unable to retrieve your student record.');
                setIsLoading(false);
            });
    };

    const handleContactSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const res = await updateMyProfile(contactForm);
            setStudent(res.student);
            setIsEditingContact(false);
            setSaveMessage('Contact information updated successfully.');
            setTimeout(() => setSaveMessage(null), 4000);
        } catch (err) {
            setError(err.message || 'Failed to update contact info.');
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = (firstName, lastName) => {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${first}${last}` || 'ST';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' }}>
            {/* Top Navigation */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)',
                marginBottom: '28px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                    }}>
                        🎓
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Student Self-Service Portal
                        </h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Logged in as student ({currentUser?.email})
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        type="button"
                        onClick={() => onNavigate('home')}
                        className="btn btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.875rem' }}
                    >
                        Home
                    </button>
                    <button
                        type="button"
                        onClick={onSignOut}
                        className="btn btn-outline"
                        style={{ padding: '8px 14px', fontSize: '0.875rem' }}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Error notice */}
            {error && (
                <div className="alert-error" role="alert" style={{ marginBottom: '20px' }}>
                    <strong>Notice: </strong>{error}
                </div>
            )}

            {/* Success notice */}
            {saveMessage && (
                <div style={{
                    marginBottom: '20px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success-text)',
                    border: '1px solid var(--success-border)',
                    fontSize: '0.875rem',
                    fontWeight: 500
                }}>
                    ✓ {saveMessage}
                </div>
            )}

            {isLoading ? (
                <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto 16px auto' }}></div>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Loading your student record from database...</p>
                </div>
            ) : !student ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <h3>No Student Record Found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Your user account does not have a linked student profile yet.
                    </p>
                    <button
                        type="button"
                        onClick={() => onNavigate('register')}
                        className="btn btn-primary"
                        style={{ marginTop: '12px' }}
                    >
                        Register Your Student Profile Now
                    </button>
                </div>
            ) : (
                <>
                    {/* Digital Student ID Badge Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-lg)',
                        padding: '32px',
                        boxShadow: 'var(--shadow-lg)',
                        marginBottom: '28px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                            <div style={{
                                width: '84px',
                                height: '84px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                border: '3px solid rgba(255, 255, 255, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 800,
                                flexShrink: 0
                            }}>
                                {getInitials(student.first_name, student.last_name)}
                            </div>

                            <div>
                                <div style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                                    Official Student Record
                                </div>
                                <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                                    {student.first_name} {student.last_name}
                                </h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        padding: '4px 10px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontFamily: 'monospace',
                                        fontSize: '0.9375rem',
                                        fontWeight: 700
                                    }}>
                                        ID: {student.registration_number}
                                    </span>
                                    <span style={{
                                        backgroundColor: student.status === 'Active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        padding: '4px 10px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600
                                    }}>
                                        ● {student.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'right',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            padding: '16px 20px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            minWidth: '200px'
                        }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                                Department
                            </div>
                            <div style={{ fontSize: '1.0625rem', fontWeight: 700, marginTop: '2px' }}>
                                {student.department}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '4px' }}>
                                {student.academic_level}
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {/* Academic Profile Details */}
                        <div className="card" style={{ padding: '28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                                <span style={{ fontSize: '1.25rem' }}>📚</span>
                                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    Academic Information
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                        Assigned Student ID
                                    </span>
                                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.9375rem' }}>
                                        {student.registration_number}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                        Major / Department
                                    </span>
                                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)' }}>
                                        {student.department}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                        Current Academic Standing
                                    </span>
                                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)' }}>
                                        {student.academic_level}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                        Enrollment Date
                                    </span>
                                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)' }}>
                                        {formatDate(student.enrollment_date)}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                        Enrollment Status
                                    </span>
                                    <div style={{ marginTop: '4px' }}>
                                        <span className={`badge-status ${student.status === 'Active' ? 'badge-status-active' : 'badge-status-other'}`}>
                                            <span className="badge-status-dot"></span>
                                            {student.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal & Editable Contact Details */}
                        <div className="card" style={{ padding: '28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.25rem' }}>📇</span>
                                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        Contact & Personal Data
                                    </h3>
                                </div>

                                {!isEditingContact && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingContact(true)}
                                        className="btn btn-secondary"
                                        style={{ padding: '4px 10px', fontSize: '0.8125rem' }}
                                    >
                                        Edit Contact
                                    </button>
                                )}
                            </div>

                            {isEditingContact ? (
                                <form onSubmit={handleContactSave}>
                                    <div className="form-group" style={{ marginBottom: '14px' }}>
                                        <label className="form-label" htmlFor="portal-phone">
                                            Phone Number <span className="form-label-required">*</span>
                                        </label>
                                        <input
                                            id="portal-phone"
                                            type="text"
                                            className="form-control"
                                            value={contactForm.phone_number}
                                            onChange={(e) => setContactForm({ ...contactForm, phone_number: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '18px' }}>
                                        <label className="form-label" htmlFor="portal-address">
                                            Residential Address
                                        </label>
                                        <textarea
                                            id="portal-address"
                                            rows={2}
                                            className="form-control"
                                            value={contactForm.address}
                                            onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingContact(false)}
                                            className="btn btn-secondary"
                                            disabled={isSaving}
                                            style={{ padding: '6px 14px' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSaving}
                                            style={{ padding: '6px 16px' }}
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                            Primary Email Address
                                        </span>
                                        <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)' }}>
                                            {student.email}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                            Phone Number
                                        </span>
                                        <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)' }}>
                                            {student.phone_number || 'No phone number provided'}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                            Date of Birth
                                        </span>
                                        <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)' }}>
                                            {formatDate(student.date_of_birth)}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                            Gender
                                        </span>
                                        <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)' }}>
                                            {student.gender}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                            Residential Address
                                        </span>
                                        <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--text-main)' }}>
                                            {student.address || 'No residential address on file'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
