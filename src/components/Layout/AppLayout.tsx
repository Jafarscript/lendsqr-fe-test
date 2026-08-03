import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import styles from './AppLayout.module.scss';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
      <div className={styles.body}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
