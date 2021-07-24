import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { hideLoader } from '../actions/LoaderAction';
import { Role } from '../constants/Role';

const Home = () => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  dispatch(hideLoader);

  if (currentUser && currentUser.roles?.includes(Role.ADMIN)) {
    history.push('/admin');
    window.location.reload();
  }

  return (
    <>
      <div className='m-auto overflow-hidden w- full xl:max-w-5xl'>
        <div className='w-full mx-auto hover:opacity-80' style={{ marginBottom: '1px' }}>
          <img
            src='https://ik.imagekit.io/tnyyngwxvx9/Background/goods_06_326104_yTL_XIkGH.jpg?updatedAt=1627141831698'
            alt=''
            className='mx-auto'
          />
        </div>
        <div className='w-1/2 float-left hover:opacity-80' style={{ paddingRight: '1px' }}>
          <img
            src='https://ik.imagekit.io/tnyyngwxvx9/Background/210722_m_mv_02_pc_D_p1k442U.jpg?updatedAt=1627141830651'
            alt=''
          />
        </div>
        <div className=' w-1/2 float-left hover:opacity-80' style={{ paddingLeft: '1px' }}>
          <img
            src='https://ik.imagekit.io/tnyyngwxvx9/Background/210722_m_mv_03_pc_kOBrl-6Me.jpg?updatedAt=1627141823992'
            alt=''
          />
        </div>
      </div>
      <section className='m-auto w-full max-w-md text-center my-20 relative'>
        <input
          type='text'
          name='keywords'
          placeholder='Search products'
          className='h-15 border-none m-0 pb-4 text-base leading-2 outline-none border-0'
          style={{ borderBottom: '1px solid #5a5a5a' }}
        />
        <button type='submit' className='absolute top-0 mt-3 right-0 mr-4'>
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
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </button>
      </section>

      <hr className='my-10' />

      <div className='w-full m-auto text-black'>
        <section
          id='sale_section'
          className='w-full'
          style={{ paddingBottom: '50px', borderBottom: '1px solid #E3E3E3' }}
        >
          <div className='mt-22 mb-20'>
            <h2 className='text-center text-xl md:text-3xl tracking-wide font-bold'>SALE NOW</h2>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
