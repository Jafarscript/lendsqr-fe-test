import styles from './TableSkeleton.module.scss';

interface TableSkeletonProps {
  /** Number of skeleton rows to render (typically the current page size). */
  rowCount: number;
  /**
   * Relative width per column, as a percentage (e.g. a short "Status" column
   * vs a long "Email" column) so the loading state roughly mirrors the real
   * content's shape instead of a uniform grid of identical bars.
   */
  columnWidths: number[];
}

export default function TableSkeleton({ rowCount, columnWidths }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <tr key={`skeleton-row-${rowIndex}`} aria-hidden="true">
          {columnWidths.map((width, colIndex) => (
            <td key={colIndex}>
              <div className={styles.bar} style={{ width: `${width}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
