import { useEffect, useState } from 'react';
import { getStudentById } from '../services/api';

export default function StudentDetailModal({ studentId, onClose, onEdit, onDelete }) {
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!studentId) return;

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        // Fetch fresh single-student data directly from backend database API: GET /api/students/{id}
        getStudentById(studentId)
            .then((data) => {
                if (isMounted) {
                    setStudent(data);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || 'Failed to load student details from database');
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [studentId]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

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

    const formatTimestamp = (ts) => {
        if (!ts) return 'N/A';
        try {
            const date = new Date(ts);
            return isNaN(date.getTime()) ? ts : date.toLocaleString();
        } catch {
            return ts;
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 0 ? `${age} years old` : null;
    };

    return (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Student Detail View</h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Live database record #{studentId}
                            </p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="modal-close-btn"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {isLoading ? (
                        <div className="loading-box" style={{ padding: '48px 16px' }}>
                            <div className="loading-spinner"></div>
                            <p className="loading-label">Loading student record from database...</p>
                        </div>
                    ) : error ? (
                        <div className="alert-error" style={{ margin: '16px 0' }}>
                            <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <div style={{ flex: 1 }}>
                                <strong>Error:</strong> {error}
                            </div>
                        </div>
                    ) : student ? (
                        <div className="detail-view-container">
                            {/* Hero summary */}
                            <div className="detail-hero">
                                <div className="detail-avatar">
                                    {getInitials(student.first_name, student.last_name)}
                                </div>
                                <div className="detail-hero-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>
                                            {student.first_name} {student.last_name}
                                        </h2>
                                        <span className={`badge-status ${student.status === 'Active' ? 'badge-status-active' : 'badge-status-other'}`}>
                                            <span className="badge-status-dot"></span>
                                            {student.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <span className="cell-reg-number">
                                            {student.registration_number}
                                        </span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {student.department} • {student.academic_level}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Sections */}
                            <div className="detail-grid">
                                {/* Academic Information */}
                                <div className="detail-card-section">
                                    <div className="detail-section-title">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                                        </svg>
                                        Academic Profile
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Department:</span>
                                        <span className="detail-val">{student.department || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Academic Level:</span>
                                        <span className="detail-val">{student.academic_level || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Enrollment Date:</span>
                                        <span className="detail-val">{formatDate(student.enrollment_date)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Enrollment Status:</span>
                                        <span className="detail-val">{student.status}</span>
                                    </div>
                                </div>

                                {/* Personal & Contact Information */}
                                <div className="detail-card-section">
                                    <div className="detail-section-title">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="8.5" cy="7.5" r="4"></circle>
                                        </svg>
                                        Personal & Contact
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Email:</span>
                                        <span className="detail-val">
                                            <a href={`mailto:${student.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                                {student.email}
                                            </a>
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Phone:</span>
                                        <span className="detail-val">
                                            <a href={`tel:${student.phone_number}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                                                {student.phone_number || 'N/A'}
                                            </a>
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Gender:</span>
                                        <span className="detail-val">{student.gender || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Date of Birth:</span>
                                        <span className="detail-val">
                                            {formatDate(student.date_of_birth)}
                                            {calculateAge(student.date_of_birth) && (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '6px' }}>
                                                    ({calculateAge(student.date_of_birth)})
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-key">Address:</span>
                                        <span className="detail-val">{student.address || 'None provided'}</span>
                                    </div>
                                </div>

                                {/* Database Record Metadata */}
                                <div className="detail-card-section" style={{ gridColumn: 'span 2' }}>
                                    <div className="detail-section-title">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                        </svg>
                                        Database Metadata
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                        <div className="detail-row">
                                            <span className="detail-key">Database ID:</span>
                                            <span className="detail-val" style={{ fontFamily: 'monospace' }}>#{student.id}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-key">Created At:</span>
                                            <span className="detail-val">{formatTimestamp(student.created_at)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-key">Updated At:</span>
                                            <span className="detail-val">{formatTimestamp(student.updated_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="btn btn-secondary"
                    >
                        Close
                    </button>
                    {student && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                className="btn btn-action-delete"
                                style={{ padding: '8px 14px' }}
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${student.first_name}?`)) {
                                        onClose();
                                        onDelete(student.id);
                                    }
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Delete
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                style={{ padding: '8px 16px' }}
                                onClick={() => {
                                    onClose();
                                    onEdit(student);
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
