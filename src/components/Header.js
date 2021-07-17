/* eslint-disable jsx-a11y/anchor-is-valid */
import { Popover } from '@headlessui/react';
import React from 'react';
import logo from '../assets/logo2.png';
import { MenuIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

// const classNames = (...classes) => {
//   return classes.filter(Boolean).join(' ');
// };

const Header = () => {
  return (
    <Popover className='relative bg-white'>
      {({ open }) => (
        <>
          <div className='max-w-7xl mx-auto px-4  border-b-2 border-gray-100  sm:px-6'>
            <div className='flex justify-between items-centermd:justify-start md:space-x-10'>
              <div className='flex justify-start lg:w-0 lg:flex-1'>
                <a href='#'>
                  <span className='sr-only'>GUT</span>
                  <img className='h-20 w-auto sm:h=10' src={logo} alt='' />
                </a>
              </div>
              <div className='-mr-2 -my-2 md:hidden'>
                <Popover.Button className='bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                  <span className='sr-only'>Open menu</span>
                  <MenuIcon className='h-6 w-6' aria-hidden='true' />
                </Popover.Button>
              </div>

              <div className='hidden md:flex items-center justify-end md:flex-1 lg:w-0'>
                <Link href='#' className='whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900'>
                  Sign in
                </Link>
                <Link
                  href='#'
                  className='ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-700 hover:bg-blue-600'
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Popover>
  );
};

export default Header;
