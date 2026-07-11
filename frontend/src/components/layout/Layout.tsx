import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { ToastContainer } from '../ui/ToastContainer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <ToastContainer />
    </div>
  );
};
