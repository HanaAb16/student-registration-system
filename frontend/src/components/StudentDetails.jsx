import { useState, useEffect } from 'react';
import { getStudentById } from '../services/api';

export default function StudentDetails({ 
    studentId, 
    onBack, 
    onEdit, 
    onDelete, 
    isAdmin = false 
}) {
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!studentId) return;

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        // Fetch single student from GET /api/students/{id}
        getStudentById(studentId)
            .then((data) => {
                if (isMounted) {
                    setStudent(data);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || 'Failed to load student details.');
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [studentId]);

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
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header Toolbar */}
            <div className="card-header" style={{ alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        type="button"
                        onClick={onBack}
                        className="btn btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
                        title="Return to student list"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to List
                    </button>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Student Profile</h2>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            Detailed database view (GET /api/students/{studentId})
                        </span>
                    </div>
                </div>

                {student && isAdmin && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(student)}
                                className="btn btn-secondary"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete(student)}
                                className="btn btn-danger"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
                {isLoading && (
                    <div className="loading-box" style={{ padding: '60px 0' }}>
                        <div className="loading-spinner"></div>
                        <p className="loading-label">Loading student record from database...</p>
                    </div>
                )}

                {error && (
                    <div className="alert-error" role="alert">
                        <strong>Error: </strong>{error}
                    </div>
                )}

                {!isLoading && !error && student && (
                    <>
                        {/* Hero Profile Summary */}
                        <div className="detail-hero" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                            <div className="detail-avatar-large" style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                flexShrink: 0
                            }}>
                                {getInitials(student.first_name, student.last_name)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        {student.first_name} {student.last_name}
                                    </h1>
                                    <span className={`badge-status ${student.status === 'Active' ? 'badge-status-active' : 'badge-status-other'}`}>
                                        <span className="badge-status-dot"></span>
                                        {student.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <span><strong>ID:</strong> {student.registration_number}</span>
                                    <span>•</span>
                                    <span><strong>Program:</strong> {student.department}</span>
                                </div>
                            </div>
                        </div>

                        {/* Attribute Grid */}
                        <div className="detail-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '16px',
                            backgroundColor: 'var(--surface-subtle)',
                            padding: '20px',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                        }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Email Address
                                </span>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {student.email}
                                </p>
                            </div>

                            <div>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Phone Number
                                </span>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {student.phone_number || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Academic Level
                                </span>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {student.academic_level}
                                </p>
                            </div>

                            <div>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Date of Birth
                                </span>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {formatDate(student.date_of_birth)}
                                </p>
                            </div>

                            <div>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Gender
                                </span>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {student.gender}
                                </p>
                            </div>

                            <div>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Enrollment Date
                                </span>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {formatDate(student.enrollment_date)}
                                </p>
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Residential Address
                                </span>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {student.address || 'No address provided'}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Footer */}
                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Record Created: {formatDate(student.created_at)}</span>
                            {student.updated_at && <span>Last Updated: {formatDate(student.updated_at)}</span>}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
