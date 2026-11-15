import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentList from '../StudentList';

describe('StudentList Component', () => {
    const mockStudents = [
        {
            id: 1,
            registration_number: 'REG-001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            department: 'Computer Science',
            status: 'Active'
        },
        {
            id: 2,
            registration_number: 'REG-002',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane@example.com',
            department: 'Software Engineering',
            status: 'Active'
        }
    ];

    const mockPaginationMeta = {
        current_page: 1,
        last_page: 3,
        per_page: 2,
        total: 5,
        from: 1,
        to: 2
    };

    it('renders students and pagination metadata correctly', () => {
        render(
            <StudentList
                students={mockStudents}
                paginationMeta={mockPaginationMeta}
                currentPage={1}
                pageSize={2}
                filters={{ search: '', status: 'ALL', department: 'ALL' }}
            />
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getAllByText(/Showing/).length).toBeGreaterThan(0);
        expect(screen.getByText('1–2')).toBeInTheDocument();
        expect(screen.getByText('5', { selector: '.count-badge' })).toBeInTheDocument();
    });

    it('triggers onPageChange when clicking Next and Prev buttons', async () => {
        const user = userEvent.setup();
        const handlePageChange = vi.fn();

        const { rerender } = render(
            <StudentList
                students={mockStudents}
                paginationMeta={mockPaginationMeta}
                currentPage={1}
                pageSize={2}
                onPageChange={handlePageChange}
            />
        );

        const nextBtn = screen.getByRole('button', { name: /Next/i });
        const prevBtn = screen.getByRole('button', { name: /Prev/i });

        // On page 1, Prev should be disabled
        expect(prevBtn).toBeDisabled();

        // Click Next
        await user.click(nextBtn);
        expect(handlePageChange).toHaveBeenCalledWith(2);

        // Re-render on page 2
        rerender(
            <StudentList
                students={mockStudents}
                paginationMeta={{ ...mockPaginationMeta, current_page: 2, from: 3, to: 4 }}
                currentPage={2}
                pageSize={2}
                onPageChange={handlePageChange}
            />
        );

        // Prev should now be enabled
        expect(screen.getByRole('button', { name: /Prev/i })).not.toBeDisabled();
    });
});
