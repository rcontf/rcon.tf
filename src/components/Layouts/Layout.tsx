import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const login = () => {
    const popupWindow = window.open(
      'http://localhost:8080/auth/steam',
      '_blank',
      'width=800, height=600'
    );
    if (document.hasFocus()) popupWindow!.focus();
  };
  const logout = () =>
    (window.location.href = 'http://localhost:8080/auth/logout');

  return (
    <>
      <Header login={login} logout={logout} />
      {children}
      <Footer />
    </>
  );
}
