import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusPill from './StatusPill';

describe('StatusPill', () => {
  it('renders the correct label for each status', () => {
    const cases: Array<[Parameters<typeof StatusPill>[0]['status'], string]> = [
      ['active', 'Active'],
      ['inactive', 'Inactive'],
      ['pending', 'Pending'],
      ['blacklisted', 'Blacklisted'],
    ];

    for (const [status, label] of cases) {
      const { unmount } = render(<StatusPill status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });
});
