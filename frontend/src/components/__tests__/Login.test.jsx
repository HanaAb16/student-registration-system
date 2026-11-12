import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';

describe('Login Component', () => {
    it('renders the sign in form with inputs and submit button', () => {
        render(<Login onLoginSuccess={vi.fn()} />);

        expect(screen.getByRole('heading', { name: /system sign in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('allows the user to type in email and password fields', async () => {
        const user = userEvent.setup();
        render(<Login onLoginSuccess={vi.fn()} />);

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await user.type(emailInput, 'admin@example.com');
        await user.type(passwordInput, 'password123');

        expect(emailInput).toHaveValue('admin@example.com');
        expect(passwordInput).toHaveValue('password123');
    });
});
