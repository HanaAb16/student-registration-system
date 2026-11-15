import { useEffect } from 'react';

export default function DeleteConfirmationModal({ 
    isOpen, 
    student, 
    onConfirm, 
    onCancel, 
    isDeleting = false 
}) {
    // Close modal on Escape key press
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !isDeleting) {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isDeleting, onCancel]);

    if (!isOpen || !student) return null;

    const studentFullName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'this student';

    return (
        <div 
            className="modal-backdrop" 
            onClick={(e) => {
                if (e.target === e.currentTarget && !isDeleting) {
                    onCancel();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <div className="modal-content" style={{ maxWidth: '480px' }}>
                <div className="modal-header" style={{ borderBottomColor: 'var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <h2 id="delete-modal-title" style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>
                            Confirm Deletion
                        </h2>
                    </div>
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="modal-close-btn" 
                        disabled={isDeleting}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        Are you sure you want to delete <strong>{studentFullName}</strong>
                        {student.registration_number ? ` (${student.registration_number})` : ''}?
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        This record will be moved to the <strong>Recycle Bin</strong> (soft-deleted). You will be able to review or restore it at any time.
                    </p>
                </div>

                <div className="modal-footer" style={{ justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(student.id)}
                        className="btn btn-danger"
                        disabled={isDeleting}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                        {isDeleting ? (
                            <>
                                <span className="loading-spinner" style={{ width: '14px', height: '14px' }}></span>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Delete Student
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
