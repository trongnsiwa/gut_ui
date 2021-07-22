/* eslint-disable jsx-a11y/anchor-is-valid */
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../actions/AuthAction';

const AdminHeader = ({ setOpenSidebar, openSidebar }) => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  const logOut = () => {
    dispatch(logout());
    history.push('/');
  };

  return (
    <nav className='text-center py-2 bg-white border-b w-full'>
      <div className='flex items-center justify-between mx-4'>
        <div className='flex items-center w-full' style={{ willChange: 'transform' }}>
          <button className='mr-4' onClick={() => setOpenSidebar((openSidebar) => !openSidebar)}>
            <svg
              stroke='currentColor'
              fill='none'
              strokeWidth='2'
              viewBox='0 0 24 24'
              strokeLinecap='round'
              strokeLinejoin='round'
              height='20'
              width='20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <line x1='3' y1='12' x2='21' y2='12'></line>
              <line x1='3' y1='6' x2='21' y2='6'></line>
              <line x1='3' y1='18' x2='21' y2='18'></line>
            </svg>
          </button>
          <form className='w-full max-w-xs mr-2'>
            <div className='relative'>
              <input
                type='search'
                name='search'
                placeholder='Search...'
                className='pl-10 pr-5 appearance-none h-10 w-full rounded-full text-sm focus:outline-none'
              />
              <button type='submit' className='absolute top-0 mt-3 left-0 ml-4'>
                <svg
                  stroke='currentColor'
                  fill='none'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='stroke-current h-4 w-4'
                  height='1em'
                  width='1em'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle cx='11' cy='11' r='8'></circle>
                  <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className='w-56 text-right'>
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
      </div>
    </nav>
  );
};

export default AdminHeader;
