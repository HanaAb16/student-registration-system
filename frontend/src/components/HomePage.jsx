export default function HomePage({ onNavigate, currentUser, onSignOut }) {
    const isStudent = currentUser?.role === 'student';
    const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'viewer';

    return (
        <div className="home-container" style={{ width: '100%', maxWidth: '1120px', margin: '0 auto', padding: '24px 20px' }}>
            {/* Top Navigation */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xs)',
                border: '1px solid var(--border)',
                marginBottom: '32px'
            }}>
                <div 
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }} 
                    onClick={() => onNavigate('home')}
                >
                    <span style={{ 
                        fontWeight: 800, 
                        fontSize: '1.25rem', 
                        color: 'var(--text-main)', 
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1
                    }}>
                        EduPortal
                    </span>
                    <span style={{ 
                        fontSize: '0.6875rem', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.08em', 
                        color: 'var(--text-muted)' 
                    }}>
                        Academic Registry & Enrollment
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {currentUser ? (
                        <>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Signed in as <strong>{currentUser.name}</strong> ({currentUser.role})
                            </span>
                            {isStudent && (
                                <button
                                    type="button"
                                    onClick={() => onNavigate('portal')}
                                    className="btn btn-primary"
                                    style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                                >
                                    My Student Portal
                                </button>
                            )}
                            {isStaff && (
                                <button
                                    type="button"
                                    onClick={() => onNavigate('admin')}
                                    className="btn btn-primary"
                                    style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                                >
                                    Admin Console
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onSignOut}
                                className="btn btn-outline"
                                style={{ padding: '8px 14px', fontSize: '0.875rem' }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => onNavigate('login')}
                                className="btn btn-outline"
                                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => onNavigate('register')}
                                className="btn btn-primary"
                                style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                            >
                                Register as Student
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section — 2-Column Institutional Split Layout */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
                alignItems: 'center',
                padding: '48px 40px',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '36px'
            }}>
                {/* Left Column: Heading, Context, and Primary CTAs */}
                <div>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--surface-alt)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '18px'
                    }}>
                        Academic Year 2026–2027
                    </div>

                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.15,
                        margin: '0 0 16px 0'
                    }}>
                        Student Registration & Academic Portal
                    </h1>

                    <p style={{
                        fontSize: '1.0625rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        margin: '0 0 28px 0',
                        maxWidth: '520px'
                    }}>
                        A centralized directory for university students and academic administration. Self-register to generate your student ID and access your academic profile, or sign in to verify your enrollment standing.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => onNavigate(currentUser ? (isStudent ? 'portal' : 'admin') : 'register')}
                            className="btn btn-primary"
                            style={{ padding: '12px 24px', fontSize: '0.9375rem', fontWeight: 600 }}
                        >
                            {currentUser ? (isStudent ? 'Go to My Student Portal' : 'Go to Admin Console') : 'Register as Student'}
                        </button>

                        {!currentUser && (
                            <button
                                type="button"
                                onClick={() => onNavigate('login')}
                                className="btn btn-secondary"
                                style={{ padding: '12px 22px', fontSize: '0.9375rem', fontWeight: 600 }}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Interactive Registry Document Preview */}
                <div style={{
                    backgroundColor: 'var(--surface-alt)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-xs)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--border)',
                        paddingBottom: '14px',
                        marginBottom: '16px'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                                Institutional Record
                            </span>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                                Student Profile Card
                            </div>
                        </div>

                        <span className="badge-status badge-status-active" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                            <span className="badge-status-dot"></span>
                            Active
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Student Name:</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Sarah M. Jenkins</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Registration ID:</span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>STU-2026-04812</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Computer Science</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Standing:</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Year 1 (Undergraduate)</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Enrollment Term:</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Fall 2026</span>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '18px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.4
                    }}>
                        Instant validation: Institutional ID generated upon self-registration with database-backed credential verification.
                    </div>
                </div>
            </section>

            {/* Architecture & Capabilities Grid — Clean Numbered Sections, No Icons */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '36px'
            }}>
                {/* Step 1 */}
                <div className="card" style={{ padding: '28px' }}>
                    <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        color: 'var(--primary)',
                        marginBottom: '12px'
                    }}>
                        01 / ENROLLMENT
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Online Self-Registration
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        Students create their profile directly by entering personal, contact, and academic details. The system generates a validated registration number and user account simultaneously.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="card" style={{ padding: '28px' }}>
                    <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        color: 'var(--primary)',
                        marginBottom: '12px'
                    }}>
                        02 / SELF-SERVICE
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Student Profile Verification
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        Authenticated students sign in to verify their active registration status, review department assignments, and maintain up-to-date residential and contact records.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="card" style={{ padding: '28px' }}>
                    <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        color: 'var(--primary)',
                        marginBottom: '12px'
                    }}>
                        03 / GOVERNANCE
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Administrative Directory
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        Faculty and registrars access complete registry oversight with server-side pagination, real-time aggregate metrics, CSV export streaming, and soft-delete recovery.
                    </p>
                </div>
            </section>

            {/* Bottom Institutional Sign-In Row */}
            <footer style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                padding: '24px 28px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Faculty and Administrative Staff
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Authorized registrars can sign in to manage directory records, run queries, and export reports.
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                >
                    Staff & Admin Sign In
                </button>
            </footer>
        </div>
    );
}
