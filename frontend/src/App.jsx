import { useEffect, useState } from 'react';
import { 
    getStudents, 
    getTrashedStudents, 
    createStudent, 
    updateStudent, 
    deleteStudent, 
    restoreStudent,
    getCurrentUser,
    logout 
} from './services/api';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetailModal from './components/StudentDetailModal';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
    // Authentication & RBAC state
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const isAdmin = currentUser?.role === 'admin';

    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrashedView, setIsTrashedView] = useState(false);
    const [statsVersion, setStatsVersion] = useState(0);

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);

    // Detail view state
    const [viewingStudentId, setViewingStudentId] = useState(null);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [isTrashedView, currentUser]);

    const fetchData = () => {
        setIsLoading(true);
        const apiCall = isTrashedView ? getTrashedStudents() : getStudents();
        apiCall
            .then(data => {
                setStudents(data);
                setIsLoading(false);
            })
            .catch(err => {
                // If token expired or is invalid, redirect back to login
                if (err.status === 401) {
                    setCurrentUser(null);
                } else {
                    setError(err.message);
                }
                setIsLoading(false);
            });
    };

    const handleFormSubmit = (formData) => {
        setError(null);
        setValidationErrors(null);
        
        const apiCall = editingStudent 
            ? updateStudent(editingStudent.id, formData)
            : createStudent(formData);

        apiCall
            .then(() => {
                setIsFormOpen(false);
                setEditingStudent(null);
                fetchData();
                setStatsVersion(v => v + 1);
            })
            .catch(err => {
                if (err.validationErrors) {
                    setValidationErrors(err.validationErrors);
                } else {
                    setError(err.message);
                }
            });
    };

    const handleEditClick = (student) => {
        setViewingStudentId(null);
        setEditingStudent(student);
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        deleteStudent(id)
            .then(() => {
                setViewingStudentId(null);
                fetchData();
                setStatsVersion(v => v + 1);
            })
            .catch(err => setError(err.message));
    };

    const handleRestore = (id) => {
        setError(null);
        restoreStudent(id)
            .then(() => {
                fetchData();
                setStatsVersion(v => v + 1);
            })
            .catch(err => setError(err.message));
    };

    const handleLogout = async () => {
        await logout();
        setCurrentUser(null);
        setStudents([]);
        setIsFormOpen(false);
        setIsTrashedView(false);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingStudent(null);
        setValidationErrors(null);
    };

    const handleViewStudent = (id) => {
        setViewingStudentId(id);
    };

    const handleCloseDetailModal = () => {
        setViewingStudentId(null);
    };

    // If unauthenticated, gate the application behind the Login screen
    if (!currentUser) {
        return (
            <div className="app-shell">
                <div className="app-container">
                    <Login onLoginSuccess={(user) => setCurrentUser(user)} />
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <div className="app-container">
                <header className="app-header">
                    <div className="brand-wrapper">
                        <div className="brand-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="app-title">Student Registration System</h1>
                            <p className="app-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span>Signed in as: <strong>{currentUser.name}</strong></span>
                                <span className={`badge-status ${isAdmin ? 'badge-status-active' : 'badge-status-other'}`} style={{ textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                                    <span className="badge-status-dot"></span>
                                    {currentUser.role}
                                </span>
                            </p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Admin-Only: Recycle Bin Toggle */}
                        {isAdmin && (
                            <button 
                                type="button"
                                className={`btn ${isTrashedView ? 'btn-secondary' : 'btn-outline'}`}
                                onClick={() => {
                                    setIsTrashedView(prev => !prev);
                                    setIsFormOpen(false);
                                }}
                                title={isTrashedView ? "Switch back to active registered students" : "View soft-deleted students in recycle bin"}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                {isTrashedView ? (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="19" y1="12" x2="5" y2="12"></line>
                                            <polyline points="12 19 5 12 12 5"></polyline>
                                        </svg>
                                        Active Students
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        Recycle Bin
                                    </>
                                )}
                            </button>
                        )}

                        {/* Admin-Only: Register Student Button */}
                        {!isFormOpen && !isTrashedView && isAdmin && (
                            <button 
                                className="btn btn-primary"
                                onClick={() => setIsFormOpen(true)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Register Student
                            </button>
                        )}

                        {/* Sign Out Button: Accessible to Everyone */}
                        <button 
                            type="button" 
                            className="btn btn-outline" 
                            onClick={handleLogout}
                            title="Sign out of the system"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </header>
                
                {error && (
                    <div className="alert-error" role="alert">
                        <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <div>
                            <strong>Error: </strong>{error}
                        </div>
                    </div>
                )}
                
                {/* Real-time Database-Aggregated Dashboard */}
                {!isFormOpen && !isTrashedView && (
                    <Dashboard refreshTrigger={statsVersion} />
                )}
                
                {isFormOpen ? (
                    <StudentForm 
                        onSubmit={handleFormSubmit} 
                        onCancel={closeForm}
                        backendErrors={validationErrors}
                        initialData={editingStudent}
                    />
                ) : (
                    isLoading ? (
                        <div className="card">
                            <div className="loading-box">
                                <div className="loading-spinner"></div>
                                <p className="loading-label">Loading students...</p>
                            </div>
                        </div>
                    ) : (
                        <StudentList 
                            students={students} 
                            onEdit={handleEditClick} 
                            onDelete={handleDelete}
                            onView={handleViewStudent}
                            isTrashedView={isTrashedView}
                            onRestore={handleRestore}
                            isAdmin={isAdmin}
                        />
                    )
                )}

                {/* Student Detail Modal */}
                {viewingStudentId && (
                    <StudentDetailModal
                        studentId={viewingStudentId}
                        onClose={handleCloseDetailModal}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                        isAdmin={isAdmin}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
