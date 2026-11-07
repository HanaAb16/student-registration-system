import { useEffect, useState } from 'react';
import { getStudents } from './services/api';
import StudentList from './components/StudentList'; // Import the new component

function App() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                Student Registration System
            </h1>
            
            {error && <p style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px' }}>Error: {error}</p>}
            
            {/* Show a loading indicator (Section 4.4 requirement) */}
            {isLoading ? (
                <p>Loading students...</p>
            ) : (
                <StudentList students={students} />
            )}
        </div>
    );
}

export default App;