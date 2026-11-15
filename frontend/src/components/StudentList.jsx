import { useState, useMemo } from 'react';
import { exportStudentsCsv } from '../services/api';

export default function StudentList({ 
    students = [], 
    paginationMeta = null,
    currentPage = 1,
    pageSize = 10,
    filters = { search: '', status: 'ALL', department: 'ALL' },
    onPageChange,
    onPageSizeChange,
    onFiltersChange,
    onEdit, 
    onDelete, 
    onView, 
    isTrashedView = false, 
    onRestore, 
    isAdmin = false 
}) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState(null);

    const searchTerm = filters?.search || '';
    const statusFilter = filters?.status || 'ALL';
    const departmentFilter = filters?.department || 'ALL';

    // Unique departments dynamically merged from known defaults + database records
    const uniqueDepartments = useMemo(() => {
        const knownDepartments = [
            'Computer Science',
            'Information Technology',
            'Software Engineering',
            'Electrical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Business Administration',
            'Data Science'
        ];
        const loadedDepartments = students
            .map((s) => s.department)
            .filter((dept) => Boolean(dept && dept.trim()));
        return Array.from(new Set([...knownDepartments, ...loadedDepartments])).sort();
    }, [students]);

    const totalRecords = paginationMeta?.total ?? students.length;
    const lastPage = paginationMeta?.last_page || 1;
    const startIndex = paginationMeta?.from ?? (students.length > 0 ? (currentPage - 1) * Number(pageSize) + 1 : 0);
    const endIndex = paginationMeta?.to ?? (students.length > 0 ? startIndex + students.length - 1 : 0);

    const handleSearchChange = (e) => {
        onFiltersChange?.({
            ...filters,
            search: e.target.value
        });
    };

    const handleStatusChange = (e) => {
        onFiltersChange?.({
            ...filters,
            status: e.target.value
        });
    };

    const handleDepartmentChange = (e) => {
        onFiltersChange?.({
            ...filters,
            department: e.target.value
        });
    };

    const handlePageSizeChange = (e) => {
        const val = Number(e.target.value);
        onPageSizeChange?.(val);
    };

    const handleResetFilters = () => {
        onFiltersChange?.({
            search: '',
            status: 'ALL',
            department: 'ALL'
        });
    };

    const isFilterActive = Boolean(
        searchTerm.trim() !== '' || 
        statusFilter !== 'ALL' || 
        departmentFilter !== 'ALL'
    );

    const getInitials = (firstName, lastName) => {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${first}${last}` || 'ST';
    };

    const handleExportCsv = async () => {
        setIsExporting(true);
        setExportError(null);
        try {
            await exportStudentsCsv({
                status: statusFilter,
                department: departmentFilter,
                search: searchTerm,
            });
        } catch (err) {
            setExportError(err.message || 'Failed to download CSV');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="card">
            {/* Card Header */}
            <div className="card-header">
                <div className="card-header-titles">
                    <h2>
                        {isTrashedView ? 'Recycle Bin' : 'Registered Students'}
                        <span className="count-badge">{totalRecords}</span>
                    </h2>
                    <p>
                        {isTrashedView 
                            ? 'Manage soft-deleted students or restore them back to the active directory'
                            : 'Overview of all student records loaded from database (Server-Side Paginated)'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Search Bar */}
                    <div className="search-wrapper">
                        <span className="search-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name, email, or ID..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Export to CSV (Active view only) */}
                    {!isTrashedView && (
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            className="btn btn-outline"
                            disabled={isExporting}
                            title="Export active student records to a CSV file"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                        >
                            {isExporting ? (
                                <>
                                    <span className="loading-spinner" style={{ width: '13px', height: '13px' }}></span>
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Export CSV
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Export Error Alert if failed */}
            {exportError && (
                <div style={{ margin: '0 24px 16px 24px', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>Export Error:</strong> {exportError}</span>
                    <button type="button" onClick={() => setExportError(null)} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                </div>
            )}

            {/* Useful Filters Toolbar */}
            <div className="filter-controls-bar">
                <div className="filters-group">
                    {/* Status Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label htmlFor="filter-status" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Status:
                        </label>
                        <select
                            id="filter-status"
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="filter-select"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Deferred">Deferred</option>
                            <option value="Graduated">Graduated</option>
                        </select>
                    </div>

                    {/* Department / Program Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label htmlFor="filter-department" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Department:
                        </label>
                        <select
                            id="filter-department"
                            value={departmentFilter}
                            onChange={handleDepartmentChange}
                            className="filter-select"
                        >
                            <option value="ALL">All Departments</option>
                            {uniqueDepartments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reset Filters button */}
                    {isFilterActive && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="btn-reset-filters"
                            title="Reset all search and filter conditions"
                        >
                            ✕ Clear Filters
                        </button>
                    )}
                </div>

                {/* Filter matches summary indicator */}
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Showing <strong>{students.length}</strong> of {totalRecords} students
                </div>
            </div>

            {/* Empty State */}
            {students.length === 0 ? (
                <div className="empty-state-box">
                    <div className="empty-icon-circle">
                        {isTrashedView ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                        )}
                    </div>
                    <p className="empty-state-text">
                        {isTrashedView ? 'Recycle Bin is empty' : 'No students match your search.'}
                    </p>
                    <p className="empty-state-hint">
                        {isTrashedView 
                            ? 'Deleted student records will appear here and can be restored back to the active registry.' 
                            : 'Try adjusting your filters or search terms, or register a new student.'}
                    </p>
                    {isFilterActive && (
                        <button 
                            type="button" 
                            onClick={handleResetFilters} 
                            className="btn btn-secondary" 
                            style={{ marginTop: '12px', fontSize: '0.8125rem', padding: '6px 14px' }}
                        >
                            Reset All Filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>
                                            <span className="cell-reg-number">
                                                {student.registration_number}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="cell-student-name">
                                                <div 
                                                    className="avatar-badge" 
                                                    style={{ cursor: onView ? 'pointer' : 'default' }}
                                                    onClick={() => onView && onView(student.id)}
                                                    title="Click to view full student details"
                                                >
                                                    {getInitials(student.first_name, student.last_name)}
                                                </div>
                                                <span 
                                                    className="name-primary name-interactive"
                                                    onClick={() => onView && onView(student.id)}
                                                    title="Click to view full student details"
                                                >
                                                    {student.first_name} {student.last_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{student.department}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            <span className={`badge-status ${student.status === 'Active' ? 'badge-status-active' : 'badge-status-other'}`}>
                                                <span className="badge-status-dot"></span>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons-group" style={{ justifyContent: 'flex-end' }}>
                                                {/* View Detail Action: Available to EVERYONE (Admin & Viewer) */}
                                                {onView && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => onView(student.id)} 
                                                        className="btn btn-action-view"
                                                        title="View full student profile from database"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                        View
                                                    </button>
                                                )}

                                                {/* Recycle Bin Restore: Admin Only */}
                                                {isTrashedView && isAdmin && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => onRestore && onRestore(student.id)} 
                                                        className="btn btn-action-restore"
                                                        title="Restore this student to active directory"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="1 4 1 10 7 10"></polyline>
                                                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                                        </svg>
                                                        Restore
                                                    </button>
                                                )}

                                                {/* Active Records: Edit & Delete are Admin Only */}
                                                {!isTrashedView && isAdmin && (
                                                    <>
                                                        <button 
                                                            type="button"
                                                            onClick={() => onEdit(student)} 
                                                            className="btn btn-action-edit"
                                                            title="Edit student"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                            Edit
                                                        </button>

                                                        <button 
                                                            type="button"
                                                            onClick={() => onDelete(student)} 
                                                            className="btn btn-action-delete"
                                                            title="Delete student"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Server-Side Pagination Bar */}
                    <div className="pagination-bar">
                        <div className="pagination-info">
                            <span>
                                Showing <strong>{startIndex}–{endIndex}</strong> of <strong>{totalRecords}</strong> students
                            </span>

                            {/* Page size dropdown */}
                            <div className="page-size-selector">
                                <label htmlFor="page-size-select">Per page:</label>
                                <select 
                                    id="page-size-select"
                                    value={pageSize} 
                                    onChange={handlePageSizeChange}
                                    className="page-size-select"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>

                        {/* Pagination Navigation */}
                        {lastPage > 1 && (
                            <div className="pagination-controls">
                                <button
                                    type="button"
                                    onClick={() => onPageChange?.(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="page-btn"
                                    title="Previous page"
                                >
                                    ‹ Prev
                                </button>

                                {Array.from({ length: lastPage }, (_, i) => i + 1)
                                    .filter(page => page === 1 || page === lastPage || Math.abs(page - currentPage) <= 2)
                                    .map((page, idx, arr) => {
                                        const prev = arr[idx - 1];
                                        return (
                                            <span key={page} style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                {prev && page - prev > 1 && (
                                                    <span style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => onPageChange?.(page)}
                                                    className={`page-btn ${page === currentPage ? 'active' : ''}`}
                                                >
                                                    {page}
                                                </button>
                                            </span>
                                        );
                                    })}

                                <button
                                    type="button"
                                    onClick={() => onPageChange?.(currentPage + 1)}
                                    disabled={currentPage >= lastPage}
                                    className="page-btn"
                                    title="Next page"
                                >
                                    Next ›
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Dataset Scaling & Justification Note */}
                    <div className="dataset-justification-note">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--primary)' }}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <span>
                            <strong>Architecture Note:</strong> Server-Side Pagination is active ({pageSize} per page). Each page transition or filter change issues a targeted SQL <code style={{ fontSize: '0.75rem', background: 'var(--bg-card)', padding: '2px 4px', borderRadius: '4px' }}>LIMIT / OFFSET</code> query, guaranteeing constant <code style={{ fontSize: '0.75rem', background: 'var(--bg-card)', padding: '2px 4px', borderRadius: '4px' }}>O(1)</code> payload sizes and zero client memory bloat on enterprise-scale datasets.
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
