import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders the title and message when both are provided', () => {
    render(<EmptyState title="No users found" message="Try adjusting your filters." />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
  });

  it('renders only the title when no message is provided', () => {
    render(<EmptyState title="No users found" />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.queryByText(/try adjusting/i)).not.toBeInTheDocument();
  });
});
