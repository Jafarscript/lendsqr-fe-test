import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ActionMenu from './ActionMenu';

function renderMenu(status: string) {
  const onBlacklist = vi.fn();
  const onActivate = vi.fn();
  render(
    <MemoryRouter>
      <ActionMenu
        userId="LSQ123"
        status={status}
        onBlacklist={onBlacklist}
        onActivate={onActivate}
      />
    </MemoryRouter>
  );
  return { onBlacklist, onActivate };
}

describe('ActionMenu', () => {
  it('is closed by default and opens when the trigger is clicked', async () => {
    const user = userEvent.setup();
    renderMenu('active');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /actions for user/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('disables "Activate User" when the user is already active', async () => {
    const user = userEvent.setup();
    renderMenu('active');
    await user.click(screen.getByRole('button', { name: /actions for user/i }));

    expect(screen.getByRole('menuitem', { name: /activate user/i })).toBeDisabled();
    expect(screen.getByRole('menuitem', { name: /blacklist user/i })).not.toBeDisabled();
  });

  it('disables "Blacklist User" when the user is already blacklisted', async () => {
    const user = userEvent.setup();
    renderMenu('blacklisted');
    await user.click(screen.getByRole('button', { name: /actions for user/i }));

    expect(screen.getByRole('menuitem', { name: /blacklist user/i })).toBeDisabled();
    expect(screen.getByRole('menuitem', { name: /activate user/i })).not.toBeDisabled();
  });

  it('calls onBlacklist and closes the menu when clicked', async () => {
    const user = userEvent.setup();
    const { onBlacklist } = renderMenu('active');
    await user.click(screen.getByRole('button', { name: /actions for user/i }));
    await user.click(screen.getByRole('menuitem', { name: /blacklist user/i }));

    expect(onBlacklist).toHaveBeenCalledWith('LSQ123');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes the menu when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderMenu('active');
    await user.click(screen.getByRole('button', { name: /actions for user/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
