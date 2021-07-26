import React from 'react';

const Footer = () => {
  return (
    <footer className='footer bg-gray-100 relative pt-1 bottom-0 left-0 mt-40'>
      <div className='container mx-auto px-6'>
        <div className='border-gray-300 flex justify-center md:justify-between items-center'>
          <div className='sm:w-2/3 text-center py-6 flex items-center'>
            <img
              src='https://ik.imagekit.io/tnyyngwxvx9/android-icon-36x36_fBT9v_rUr.png?updatedAt=1627293026194'
              alt=''
              className='mr-3'
            />
            <p className='text-xs md:text-sm text-brand-dark font-bold mb-2'>
              COPYRIGHT © GUT CO., LTD, ALL RIGHTS RESERVED{' '}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
