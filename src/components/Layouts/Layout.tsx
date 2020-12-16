import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const login = () => (window.location.href = 'http://localhost:8080/auth/steam');
  const logout = () => (window.location.href = 'http://localhost:8080/auth/logout');

  return (
    <>
      <Header login={login} logout={logout} />
      {children}
      {/* <Footer /> */}
    </>
  );
}
