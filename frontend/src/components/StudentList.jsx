import { useState } from 'react';

export default function StudentList({ students }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter the students array based on the search input
    const filteredStudents = students.filter((student) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            student.first_name.toLowerCase().includes(searchLower) ||
            student.last_name.toLowerCase().includes(searchLower) ||
            student.email.toLowerCase().includes(searchLower) ||
            student.registration_number.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h2>Registered Students ({filteredStudents.length})</h2>
                
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', width: '250px' }}
                />
            </div>

            {/* Empty State Requirement (Section 4.3) */}
            {filteredStudents.length === 0 ? (
                <p style={{ color: 'gray', fontStyle: 'italic' }}>No students match your search.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>Name</th>
                            <th style={{ padding: '10px' }}>Department</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{student.registration_number}</td>
                                <td style={{ padding: '10px' }}>{student.first_name} {student.last_name}</td>
                                <td style={{ padding: '10px' }}>{student.department}</td>
                                <td style={{ padding: '10px' }}>{student.email}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        padding: '4px 8px', 
                                        borderRadius: '12px', 
                                        backgroundColor: student.status === 'Active' ? '#d4edda' : '#fff3cd',
                                        fontSize: '0.85em'
                                    }}>
                                        {student.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {/* We will wire these buttons up next */}
                                    <button style={{ marginRight: '10px' }}>Edit</button>
                                    <button style={{ color: 'red' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}