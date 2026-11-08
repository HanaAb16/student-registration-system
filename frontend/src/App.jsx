import { useEffect, useState } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from './services/api';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetailModal from './components/StudentDetailModal';

function App() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null); // Tracks who we are editing

    // Detail view state
    const [viewingStudentId, setViewingStudentId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        getStudents()
            .then(data => {
                setStudents(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    };

    const handleFormSubmit = (formData) => {
        setError(null);
        setValidationErrors(null);
        
        // If we are editing, call updateStudent. Otherwise, call createStudent.
        const apiCall = editingStudent 
            ? updateStudent(editingStudent.id, formData)
            : createStudent(formData);

        apiCall
            .then(() => {
                setIsFormOpen(false);
                setEditingStudent(null);
                fetchData();
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
            })
            .catch(err => setError(err.message));
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
                            <p className="app-subtitle">Manage student enrollments, academic levels, and department records</p>
                        </div>
                    </div>
                    
                    {!isFormOpen && (
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
                        />
                    )
                )}

                {/* Student Detail Modal (fetches live record from backend database: GET /api/students/{id}) */}
                {viewingStudentId && (
                    <StudentDetailModal
                        studentId={viewingStudentId}
                        onClose={handleCloseDetailModal}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
