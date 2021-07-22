/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './SubMenu.css';

const SubMenu = ({ item }) => {
  const [subNav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subNav);

  return (
    <div>
      {item.subNav ? (
        <button className='btn-dash-main' onClick={item.subNav && showSubnav}>
          <span className='flex items-center mx-4'>
            {item.icon}
            <span className='font-medium pl-2'>{item.title}</span>
          </span>

          <span>
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                x-show='! open'
                d='M9 5L16 12L9 19'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={item.subNav && !subNav ? '' : 'hidden'}
              ></path>
              <path
                x-show='open'
                d='M19 9L12 16L5 9'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={item.subNav && subNav ? '' : 'hidden'}
              ></path>
            </svg>
          </span>
        </button>
      ) : (
        <Link to={item.link} className='btn-dash-main'>
          <span className='flex items-center mx-4'>
            {item.icon}
            <span className='font-medium pl-2'>{item.title}</span>
          </span>
        </Link>
      )}

      {subNav &&
        item.subNav.map((item, index) => {
          return (
            <div className='bg-gray-100' key={index}>
              <NavLink activeStyle={{ color: '#44A5CA' }} className={`btn-dash-child flex`} to={item.link}>
                {item.icon}
                <span className='pl-2'>{item.title}</span>
              </NavLink>
            </div>
          );
        })}
    </div>
  );
};

export default SubMenu;
