import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../HomePage';

describe('HomePage Component', () => {
    it('renders hero title and call to action buttons for guests', () => {
        render(<HomePage onNavigate={vi.fn()} currentUser={null} onSignOut={vi.fn()} />);

        expect(screen.getByText(/Student Registration & Academic Portal/i)).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /Register as Student/i }).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByRole('button', { name: /Sign In/i }).length).toBeGreaterThanOrEqual(1);
    });

    it('navigates to register view when clicking register button', async () => {
        const user = userEvent.setup();
        const handleNavigate = vi.fn();

        render(<HomePage onNavigate={handleNavigate} currentUser={null} onSignOut={vi.fn()} />);

        const registerBtns = screen.getAllByRole('button', { name: /Register as Student/i });
        await user.click(registerBtns[0]);

        expect(handleNavigate).toHaveBeenCalledWith('register');
    });

    it('displays student portal navigation when signed in as student', () => {
        render(
            <HomePage
                onNavigate={vi.fn()}
                currentUser={{ name: 'Alice Smith', email: 'alice@student.edu', role: 'student' }}
                onSignOut={vi.fn()}
            />
        );

        expect(screen.getByText(/Alice Smith/)).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /Student Portal/i }).length).toBeGreaterThanOrEqual(1);
    });
});
