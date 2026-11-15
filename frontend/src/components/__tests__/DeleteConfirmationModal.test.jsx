import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

describe('DeleteConfirmationModal Component', () => {
    const mockStudent = {
        id: 42,
        first_name: 'John',
        last_name: 'Doe',
        registration_number: 'REG-1234'
    };

    it('does not render when isOpen is false', () => {
        render(
            <DeleteConfirmationModal
                isOpen={false}
                student={mockStudent}
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        expect(screen.queryByText(/Confirm Deletion/i)).not.toBeInTheDocument();
    });

    it('renders student details when isOpen is true', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                student={mockStudent}
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/\(REG-1234\)/i)).toBeInTheDocument();
    });

    it('invokes onConfirm when the Delete button is clicked', async () => {
        const user = userEvent.setup();
        const handleConfirm = vi.fn();

        render(
            <DeleteConfirmationModal
                isOpen={true}
                student={mockStudent}
                onConfirm={handleConfirm}
                onCancel={vi.fn()}
            />
        );

        const deleteBtn = screen.getByRole('button', { name: /Delete Student/i });
        await user.click(deleteBtn);

        expect(handleConfirm).toHaveBeenCalledWith(42);
    });

    it('invokes onCancel when the Cancel button is clicked', async () => {
        const user = userEvent.setup();
        const handleCancel = vi.fn();

        render(
            <DeleteConfirmationModal
                isOpen={true}
                student={mockStudent}
                onConfirm={vi.fn()}
                onCancel={handleCancel}
            />
        );

        const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
        await user.click(cancelBtn);

        expect(handleCancel).toHaveBeenCalled();
    });
});
