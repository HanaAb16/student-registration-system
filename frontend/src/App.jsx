import { useEffect, useState } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from './services/api';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

function App() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null); // Tracks who we are editing

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
        setEditingStudent(student);
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        deleteStudent(id)
            .then(() => fetchData())
            .catch(err => setError(err.message));
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingStudent(null);
        setValidationErrors(null);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Student Registration System</h1>
                
                {!isFormOpen && (
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Register Student
                    </button>
                )}
            </div>
            
            {error && <p style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '5px' }}>Error: {error}</p>}
            
            {isFormOpen ? (
                <StudentForm 
                    onSubmit={handleFormSubmit} 
                    onCancel={closeForm}
                    backendErrors={validationErrors}
                    initialData={editingStudent}
                />
            ) : (
                isLoading ? (
                    <p>Loading students...</p>
                ) : (
                    <StudentList 
                        students={students} 
                        onEdit={handleEditClick} 
                        onDelete={handleDelete} 
                    />
                )
            )}
        </div>
    );
}

export default App;