/* eslint-disable jsx-a11y/anchor-is-valid */
import { Menu, Popover, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { ChevronDownIcon, ChevronRightIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link, useHistory } from 'react-router-dom';
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/AuthAction';
import { hideLoader, showLoader } from '../../actions/LoaderAction';
import { getAllParentCategories } from '../../services/category.service';
import { Role } from '../../constants/Role';
import { lowerCaseString } from '../../helpers/String';

const Header = () => {
  const { user: currentUser } = useSelector((state) => state.authReducer);

  const dispatch = useDispatch();
  const history = useHistory();

  const [parentCategories, setParentCategories] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  useEffect(() => {
    dispatch(showLoader);

    getAllParentCategories().then(
      (res) => {
        setParentCategories(res.data.data);
        console.log(res.data.data);
        dispatch(hideLoader);
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        console.log(message);
        dispatch(hideLoader);
      }
    );
  }, [dispatch]);

  const logOut = () => {
    dispatch(showLoader);

    dispatch(logout());
    history.push('/');
  };

  return (
    <Popover
      className='fixed bg-white top-0 w-full'
      style={{ boxShadow: '0px 0px 5px rgb(0 0 0 / 40%)', zIndex: '99999' }}
    >
      {({ open }) => (
        <>
          <div className='max-w-7xl mx-auto px-4 sm:px-6'>
            <div className='flex justify-between items-center md:justify-start md:space-x-10'>
              <div className='flex justify-start'>
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
              {!currentUser?.roles?.includes(Role.ADMIN) && (
                <Popover.Group as='nav' className='hidden md:flex space-x-10'>
                  <Popover className='relative'>
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`${
                            open ? 'text gray-900' : 'text-gray-500'
                          } group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none`}
                        >
                          <span className='text-lg font-semibold text-gray-700'>CATEGORY</span>
                          <ChevronDownIcon
                            className={`${
                              open ? 'text-gray-600' : 'text-gray-400'
                            } ml-2 h-5 w-5 group-hover:text-gray-500`}
                            aria-hidden='true'
                          />
                        </Popover.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          enter='transition ease-out duration-150'
                          enterFrom='opacity-0 translate-y-1'
                          enterTo='opacity-100 translate-y-0'
                          leave='transition ease-in duration-150'
                          leaveFrom='opacity-100 translate-y-0'
                          leaveTo='opacity-0 translate-y-1'
                        >
                          <Popover.Panel className='bg-white absolute mt-7 p-5 w-screen max-w-md shadow-lg z-50 '>
                            <div className='grid grid-cols-2'>
                              <div style={{ boxShadow: 'rgb(0 0 0 / 10%) 5px 0px 4px -3px' }}>
                                <div className='flex w-full items-center h-10 mb-3 p-5' key={'ALL'}>
                                  <span className='text-base text-gray-600 font-semibold cursor-default flex items-center'>
                                    Category
                                  </span>
                                </div>
                                {parentCategories &&
                                  parentCategories.map((parent) => (
                                    <div
                                      className={`flex w-full items-center h-12 hover:bg-gray-100 p-5 ${
                                        selectedParent && parent.id === selectedParent.id ? 'bg-gray-100' : ''
                                      }`}
                                      key={parent.id}
                                      onClick={() => setSelectedParent(parent)}
                                    >
                                      <span className='text-sm text-gray-600  cursor-default'>{parent.name}</span>
                                    </div>
                                  ))}
                              </div>
                              <div className='pl-5'>
                                {selectedParent && (
                                  <div className='flex w-full items-center h-10 p-5 mb-3' key={'parent'}>
                                    <span className='text-lg text-gray-600 font-semibold cursor-default'>
                                      {selectedParent.name}
                                    </span>
                                  </div>
                                )}

                                {selectedParent &&
                                  selectedParent.subCategories?.map((sub) => (
                                    <div className='flex w-full items-center p-5 h-12' key={sub.id}>
                                      <Link
                                        to={{
                                          pathname: `/category/${lowerCaseString(
                                            selectedParent.name
                                          )}/${lowerCaseString(sub.name)}`,
                                          state: {
                                            id: sub.id,
                                            parentId: selectedParent.id,
                                          },
                                        }}
                                        className='text-sm text-gray-600  cursor-pointer hover:underline'
                                      >
                                        {sub.name}
                                      </Link>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </Popover.Group>
              )}

              <div className='hidden md:flex items-center justify-end md:flex-1 lg:w-0'>
                {currentUser ? (
                  <div className='text-right'>
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
                            <p className='pl-4 text-sm font-semibold text-gray-600'>{currentUser.fullname}</p>
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
                                    <p className='text-sm font-medium'>Log out</p>
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
                <div className='text-gray-600 ml-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 cursor-pointer'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
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
                  <div className='h-full overflow-auto mb-10'>
                    <dl className='block'>
                      {parentCategories &&
                        parentCategories.map((parent) => (
                          <React.Fragment key={`${parent.id}_small`}>
                            <dt
                              className='flex w-full items-center justify-between list-none border-gray-400 border-solid relative bg-white z-20'
                              style={{ height: '55px', marginTop: '-1px', borderWidth: '1px 0' }}
                              onClick={() => {
                                if (selectedParent !== parent) {
                                  setSelectedParent(parent);
                                } else {
                                  setSelectedParent(null);
                                }
                              }}
                            >
                              <span className='relative pl-2 text-sm font-bold text-gray-600 align-middle m-0 no-underline'>
                                {parent.name}
                              </span>
                              {selectedParent && selectedParent.id === parent.id ? (
                                <ChevronDownIcon className='h-4 w-4' />
                              ) : (
                                <ChevronRightIcon className='h-4 w-4' />
                              )}
                            </dt>
                            {parent.subCategories && (
                              <Transition
                                show={selectedParent?.id === parent.id}
                                as={Fragment}
                                enter='transition ease-in-out duration-300 transform'
                                enterFrom='-translate-y-full'
                                enterTo='translate-y-0'
                                leave='transition ease-in-out duration-300 transform'
                                leaveFrom='translate-y-0'
                                leaveTo='-translate-y-full'
                              >
                                <dd className='z-0'>
                                  <ul className='grid grid-cols-2 list-none p-0 cursor-pointer'>
                                    {parent.subCategories.map((sub) => (
                                      <li
                                        style={{ borderBottom: '1px solid #dadada', borderRight: '1px solid #dadada' }}
                                        key={`${sub.id}_small`}
                                        className='p-4 text-sm'
                                      >
                                        {sub.name}
                                      </li>
                                    ))}
                                  </ul>
                                </dd>
                              </Transition>
                            )}
                          </React.Fragment>
                        ))}
                    </dl>
                  </div>
                  <div>
                    {currentUser ? (
                      <>
                        <div className='flex justify-between w-full'>
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
                              <p className='pl-4 text-sm font-semibold text-gray-600 font-sans'>
                                {currentUser.fullname}
                              </p>
                            </div>
                          </Link>
                          <div className='text-gray-700'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-8 w-8 cursor-pointer'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                              />
                            </svg>
                          </div>
                        </div>

                        <a
                          href='/'
                          className='w-full flex items-center justify-center px-4 py-2 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700'
                          onClick={logOut}
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
