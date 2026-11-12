import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';

function StatCard({ label, value, icon, colorClass, helperText }) {
    return (
        <div className={`stat-card ${colorClass}`}>
            <div className="stat-card-header">
                <span className="stat-card-label">{label}</span>
                <span className="stat-card-icon">{icon}</span>
            </div>
            <div className="stat-card-value">{value ?? 0}</div>
            {helperText && <div className="stat-card-helper">{helperText}</div>}
        </div>
    );
}

export default function Dashboard({ refreshTrigger }) {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStats = () => {
        setIsLoading(true);
        getDashboardStats()
            .then((data) => {
                setStats(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadStats();
    }, [refreshTrigger]);

    if (isLoading && !stats) {
        return (
            <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                    <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                    <span style={{ fontSize: '0.875rem' }}>Loading dashboard statistics...</span>
                </div>
            </div>
        );
    }

    if (error && !stats) {
        return null; // Gracefully degrade without breaking the main student table
    }

    return (
        <section className="dashboard-section" aria-label="Statistical Dashboard">
            {/* Row of Stat Cards */}
            <div className="dashboard-grid">
                <StatCard 
                    label="Total Students" 
                    value={stats.total_students} 
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    }
                    colorClass="stat-card-primary"
                    helperText="Active database records"
                />
                <StatCard 
                    label="Active" 
                    value={stats.status_counts.Active} 
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    }
                    colorClass="stat-card-success"
                    helperText="Currently enrolled"
                />
                <StatCard 
                    label="Deferred" 
                    value={stats.status_counts.Deferred} 
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    }
                    colorClass="stat-card-warning"
                    helperText="Studies on hold"
                />
                <StatCard 
                    label="Graduated" 
                    value={stats.status_counts.Graduated} 
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                    }
                    colorClass="stat-card-info"
                    helperText="Alumni members"
                />
                <StatCard 
                    label="In Recycle Bin" 
                    value={stats.trashed_count} 
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    }
                    colorClass="stat-card-danger"
                    helperText="Soft-deleted students"
                />
            </div>

            {/* Department Breakdown Bar */}
            {stats.department_counts && stats.department_counts.length > 0 && (
                <div className="department-breakdown-card">
                    <div className="department-breakdown-header">
                        <span className="department-breakdown-title">
                            Enrollment by Department
                        </span>
                        <span className="department-breakdown-count">
                            {stats.department_counts.length} {stats.department_counts.length === 1 ? 'Department' : 'Departments'}
                        </span>
                    </div>
                    <div className="department-tags-list">
                        {stats.department_counts.map((dept) => (
                            <div key={dept.department} className="department-pill">
                                <span className="dept-name">{dept.department}</span>
                                <span className="dept-badge">{dept.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
