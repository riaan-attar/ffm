import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../footer/Footer';
import { ScrollToHash } from './ScrollToHash';
import { ScrollToTopButton } from './ScrollToTopButton';

export function Layout() {
  return (
    <div className="page-wrapper">
      <ScrollToHash />
      {/* Each page renders its own <Navbar /> at the top, since the home
          page needs it inside the hero's flex layout while inner pages
          render it before their own page banner. */}
      <Outlet />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
