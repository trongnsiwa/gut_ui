/* eslint-disable jsx-a11y/anchor-is-valid */
import { Transition } from '@headlessui/react';
import React from 'react';
import logo from '../../assets/logo.png';
import bars from '../../data/sidebarData';
import SubMenu from './SubMenu.js';

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  return (
    <Transition
      appear={true}
      show={openSidebar}
      enter='transition-all duration-500'
      enterFrom='-ml-64'
      enterTo='ml-0'
      leave='transiton-all duration-500'
      leaveFrom='ml-0'
      leaveTo='-ml-64'
    >
      <div className={`z-10 absolute sm:sticky w-64 h-screen bg-white border border-r-2`}>
        <div className='flex items-center justify-between px-4'>
          <div className='flex items-center'>
            <img className='h-16 w-16' src={logo} alt='GUT' />
            <p className='text-lg font-extrabold text-brand-dark pl-2 leading-none'>
              GUT
              <br /> D-BOARD
            </p>
          </div>

          <button className='mb-2' onClick={() => setOpenSidebar((openSidebar) => !openSidebar)}>
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
        </div>

        <nav className='mt-10'>{bars && bars.map((item, index) => <SubMenu item={item} key={index} />)}</nav>
      </div>
    </Transition>
  );
};

export default Sidebar;
