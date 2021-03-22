import React, { useEffect } from 'react';
import Header from './Header';
// import Footer from './Footer';

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const login = () => window.location.replace('/api/auth/steam');
  const logout = () => window.location.replace('/api/auth/logout');

  useEffect(() => {
    document.title = title ?? 'rcon.tf';
  }, []);

  return (
    <>
      <Header login={login} logout={logout} />
      {children}
      {/* <Footer /> */}
    </>
  );
}
