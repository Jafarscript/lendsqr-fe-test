import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from './ErrorState';

describe('ErrorState', () => {
  it('renders the provided error message', () => {
    render(<ErrorState message="Failed to fetch users." onRetry={() => {}} />);
    expect(screen.getByText('Failed to fetch users.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls onRetry exactly once when the retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Something went wrong." onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not call onRetry if the button is never clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Something went wrong." onRetry={onRetry} />);
    expect(onRetry).not.toHaveBeenCalled();
  });
});
