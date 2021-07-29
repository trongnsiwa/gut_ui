import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <div class='bg-gradient-to-r from-blue-300 to-blue-200'>
        <div class='w-9/12 m-auto py-16 flex items-center justify-center' style={{ height: 'calc(100vh - 80px)' }}>
          <div class='bg-white shadow overflow-hidden sm:rounded-lg pb-8'>
            <div class='text-center pt-8'>
              <h1 class='text-9xl font-bold text-brand'>404</h1>
              <h1 class='text-5xl font-medium font-mono pb-8 pt-3'>Oops! Page not found</h1>
              <p class='text-2xl pb-8 px-12 font-mono'>
                The page you are looking for does not exist. It might have been moved or deleted.
              </p>
              <Link
                to='/'
                class='bg-gradient-to-r from-brand-light to-brand hover:from-brand-dark hover:to-brand text-white font-semibold px-6 py-3 rounded-md'
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
