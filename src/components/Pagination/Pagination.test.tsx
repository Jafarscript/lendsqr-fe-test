import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('disables the "Previous" button on the first page', () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={100}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
  });

  it('disables the "Next" button on the last page', () => {
    render(
      <Pagination
        page={10}
        pageSize={10}
        total={100}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
  });

  it('renders every page number without ellipsis when there are 7 or fewer pages', () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={70}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByLabelText(`Page ${i}`)).toBeInTheDocument();
    }
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('collapses distant pages behind an ellipsis for large page counts', () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={160}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 16')).toBeInTheDocument();
    expect(screen.queryByLabelText('Page 10')).not.toBeInTheDocument();
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });

  it('calls onPageChange with the clicked page number', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={70}
        onPageChange={onPageChange}
        onPageSizeChange={() => {}}
      />
    );

    await user.click(screen.getByLabelText('Page 3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageSizeChange with the selected value', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={70}
        onPageChange={() => {}}
        onPageSizeChange={onPageSizeChange}
      />
    );

    await user.selectOptions(screen.getByLabelText('Results per page'), '50');
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it('marks the current page with aria-current for accessibility', () => {
    render(
      <Pagination
        page={3}
        pageSize={10}
        total={70}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    );
    expect(screen.getByLabelText('Page 3')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Page 1')).not.toHaveAttribute('aria-current');
  });
});
