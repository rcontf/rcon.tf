import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <Link to='/test'>
          Test
      </Link>
      Hello Wolrd
    </div>
  );
}
