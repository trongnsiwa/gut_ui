/* eslint-disable jsx-a11y/anchor-is-valid */
import { Menu, Popover, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import logo from '../../assets/logo.png';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/AuthAction';

const Header = () => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Popover className='relative bg-white' style={{ boxShadow: '0px 0px 5px rgb(0 0 0 / 40%)' }}>
      {({ open }) => (
        <>
          <div className='max-w-7xl mx-auto px-4 sm:px-6'>
            <div className='flex justify-between items-center  md:justify-start md:space-x-10'>
              <div className='flex justify-start lg:w-0 lg:flex-1'>
                <Link to='/'>
                  <span className='sr-only'>GUT</span>
                  <img className='h-14 my-2 w-auto sm:h-16' src={logo} alt='' />
                </Link>
              </div>
              <div className='-mr-2 -my-2 md:hidden'>
                <Popover.Button className='btn-menu'>
                  <span className='sr-only'>Open menu</span>
                  <MenuIcon className='h-6 w-6' aria-hidden='true' />
                </Popover.Button>
              </div>

              <div className='hidden md:flex items-center justify-end md:flex-1 lg:w-0'>
                {currentUser ? (
                  <div className='className=' w-56 text-right fixed>
                    <Menu as='div' className='relative inline-block text-left'>
                      <div>
                        <Menu.Button>
                          <div className='inline-flex -space-x-1 overflow-hidden justify-center items-center'>
                            <img
                              className='inline-block h-8 w-8 rounded-full ring-2 ring-white'
                              src={
                                currentUser.avatar
                                  ? currentUser.avatar
                                  : 'https://ik.imagekit.io/tnyyngwxvx9/default_28FGC8ZwZ.png'
                              }
                              alt=''
                            />
                            <p className='pl-4 text-base font-medium text-gray-900'>{currentUser.fullname}</p>
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                      >
                        <Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                          <div className='px-1 py-1'>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href='/'
                                  className={`${
                                    active ? 'bg-brand-light text-white' : 'text-gray-900'
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                  onClick={logOut}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                                    />
                                  </svg>
                                  <div className='ml-2'>
                                    <p className='text-base font-medium'>Log out</p>
                                  </div>
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <>
                    <Link
                      to='/signin'
                      className='whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900'
                    >
                      Sign in
                    </Link>
                    <Link
                      to='/signup'
                      className='ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand hover:bg-brand-dark'
                    >
                      Sign up
                    </Link>
                  </>
                )}
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
                  <div className='flex items-center justify-between mb-3'>
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
                    {currentUser ? (
                      <>
                        <Link to='/profile'>
                          <div className='flex -space-x-1 overflow-hidden justify-start items-center'>
                            <img
                              className='inline-block h-8 w-8 rounded-full ring-2 ring-white'
                              src={
                                currentUser.avatar
                                  ? currentUser.avatar
                                  : 'https://ik.imagekit.io/tnyyngwxvx9/default_28FGC8ZwZ.png'
                              }
                              alt=''
                            />
                            <p className='pl-4 text-base font-medium text-gray-600'>{currentUser.fullname}</p>
                          </div>
                        </Link>

                        <a
                          href='/'
                          className='w-full flex items-center justify-center px-4 py-2 mt-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6 mr-2'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                            />
                          </svg>
                          Log out
                        </a>
                      </>
                    ) : (
                      <>
                        <Link
                          to='/signup'
                          className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand hover:bg-brand-dark'
                        >
                          Sign up
                        </Link>
                        <p className='mt-6 text-center text-base font-medium text-gray-500'>
                          Already have account?{' '}
                          <Link to='/signin' className='text-brand hover:text-brand-light'>
                            Sign in
                          </Link>
                        </p>
                      </>
                    )}
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
