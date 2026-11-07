import { useEffect, useState } from 'react';
import { getStudents, createStudent } from './services/api';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

function App() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState(null);

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

    const handleAddStudent = (formData) => {
        // Clear previous errors before trying
        setError(null);
        setValidationErrors(null);
        
        createStudent(formData)
            .then(() => {
                // Success: Close the form and fetch the updated list
                setIsFormOpen(false);
                fetchData();
            })
            .catch(err => {
                // Failure: If Laravel sent specific field errors, show them. Otherwise show generic error.
                if (err.validationErrors) {
                    setValidationErrors(err.validationErrors);
                } else {
                    setError(err.message);
                }
            });
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Student Registration System</h1>
                
                {/* Register Button toggles the form */}
                {!isFormOpen && (
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Register Student
                    </button>
                )}
            </div>
            
            {/* Generic System Errors */}
            {error && <p style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '5px' }}>Error: {error}</p>}
            
            {/* Conditional Rendering: Show Form OR Show Table */}
            {isFormOpen ? (
                <StudentForm 
                    onSubmit={handleAddStudent} 
                    onCancel={() => {
                        setIsFormOpen(false);
                        setValidationErrors(null);
                    }}
                    backendErrors={validationErrors}
                />
            ) : (
                isLoading ? (
                    <p>Loading students...</p>
                ) : (
                    <StudentList students={students} />
                )
            )}
        </div>
    );
}

export default App;