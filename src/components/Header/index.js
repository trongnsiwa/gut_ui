/* eslint-disable jsx-a11y/anchor-is-valid */
import { Popover, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import logo from '../../assets/logo.png';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import './Header.css';

// const classNames = (...classes) => {
//   return classes.filter(Boolean).join(' ');
// };

const Header = () => {
  return (
    <Popover className='relative bg-white'>
      {({ open }) => (
        <>
          <div className='max-w-7xl mx-auto px-4 sm:px-6'>
            <div className='flex justify-between items-center md:justify-start md:space-x-10'>
              <div className='flex justify-start lg:w-0 lg:flex-1'>
                <a href='#'>
                  <span className='sr-only'>GUT</span>
                  <img className='h-14 my-2 w-auto sm:h-16' src={logo} alt='' />
                </a>
              </div>
              <div className='-mr-2 -my-2 md:hidden'>
                <Popover.Button className='btn-menu'>
                  <span className='sr-only'>Open menu</span>
                  <MenuIcon className='h-6 w-6' aria-hidden='true' />
                </Popover.Button>
              </div>

              <div className='hidden md:flex items-center justify-end md:flex-1 lg:w-0'>
                <Link
                  to='/signin'
                  className='whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900'
                >
                  Sign in
                </Link>
                <Link
                  href='#'
                  className='ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand hover:bg-brand-dark'
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter='duration-200 ease-out'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='duration-100 ease-in'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Popover.Panel
              focus
              static
              className='absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden'
            >
              <div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50'>
                <div className='pt-5 pb-6 px-5'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <img className='h-14 my-2 w-auto' src={logo} alt='GUT' />
                    </div>
                    <div>
                      <Popover.Button className='btn-menu'>
                        <span className='sr-only'>Close menu</span>
                        <XIcon className='h-6 w-6' aria-hidden='true' />
                      </Popover.Button>
                    </div>
                  </div>
                  <div>
                    <a
                      href='#'
                      className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand hover:bg-brand-dark'
                    >
                      Sign up
                    </a>
                    <p className='mt-6 text-center text-base font-medium text-gray-500'>
                      Already have account?{' '}
                      <Link to='/signin' className='text-brand hover:text-brand-light'>
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Header;
