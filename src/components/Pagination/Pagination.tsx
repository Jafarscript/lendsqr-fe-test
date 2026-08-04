import { ICONS } from '../../constants/icons';
import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function getPageNumbers(current: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < totalPages - 2) pages.push('ellipsis');

  pages.push(totalPages);
  return pages;
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = getPageNumbers(page, totalPages);

  const SelectCaretIcon = ICONS.selectCaret;
  const PaginationPrevIcon = ICONS.paginationPrev;
  const PaginationNextIcon = ICONS.paginationNext;

  return (
    <nav className={styles.wrapper} aria-label="Users table pagination">
      <div className={styles.pageSizeGroup}>
        <span>Showing</span>
        <span className={styles.selectWrap}>
          <select
            className={styles.select}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Results per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className={styles.selectChevron} aria-hidden="true">
            <SelectCaretIcon size={14} strokeWidth={2.5} />
          </span>
        </span>
        <span>out of {total}</span>
      </div>

      <div className={styles.pages}>
        <button
          type="button"
          className={styles.arrowButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <PaginationPrevIcon size={14} strokeWidth={2.5} />
        </button>

        {pageNumbers.map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`${styles.pageButton} ${p === page ? styles.pageButtonActive : ''}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className={styles.arrowButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <PaginationNextIcon size={14} strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}
