import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import StudentPortal from '../StudentPortal';
import * as api from '../../services/api';

vi.mock('../../services/api', () => ({
    getMyProfile: vi.fn(),
    updateMyProfile: vi.fn(),
}));

describe('StudentPortal Component', () => {
    const mockStudent = {
        id: 99,
        registration_number: 'STU-2026-99999',
        first_name: 'Harry',
        last_name: 'Potter',
        email: 'harry@hogwarts.edu',
        phone_number: '+1555123456',
        department: 'Defense Against the Dark Arts',
        academic_level: 'Year 4',
        enrollment_date: '2026-09-01',
        status: 'Active',
        date_of_birth: '2000-07-31',
        gender: 'Male',
        address: 'Gryffindor Tower',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and renders the student profile details', async () => {
        api.getMyProfile.mockResolvedValue(mockStudent);

        render(
            <StudentPortal
                currentUser={{ name: 'Harry Potter', email: 'harry@hogwarts.edu', role: 'student' }}
                onSignOut={vi.fn()}
                onNavigate={vi.fn()}
            />
        );

        expect(screen.getByText(/Loading your student record/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Harry Potter')).toBeInTheDocument();
            expect(screen.getAllByText(/STU-2026-99999/).length).toBeGreaterThan(0);
            expect(screen.getAllByText('Defense Against the Dark Arts').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Year 4').length).toBeGreaterThan(0);
        });
    });
});
