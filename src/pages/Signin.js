/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Signin = () => {
  const imagePath = 'https://ik.imagekit.io/tnyyngwxvx9/Background/fc7d5755f69adc1fd50cb48f8e7a578e_7h0gsh0ns.jpg';
  return (
    <>
      <div className='container mx-auto'>
        <section className='flex justify-center px-6 my-12'>
          <div className='w-full xl:w-3/4 lg:w-11/12 flex'>
            <div
              className='hidden md:block w-full h-auto md:w-2/3 lg:w-1/2 bg-gray-400 bg-cover rounded-l-lg bg-center'
              style={{
                backgroundImage: `url('${imagePath}')`,
              }}
            ></div>
            <div
              className='bg-white w-full rounded-lg lg:rounded-l-none md:max-w-md p-5 lg:max-w-full border border-gray-100 md:1/3 lg:w-1/2 h-full px-6 lg:px-16 xl:px-12
        flex flex-col'
            >
              <div className='text-left mt-12 mb-3 xl:mb-6'>
                <h1 className='text-3xl text-brand-dark xl:text-4xl font-bold leading-tight'>Welcome to GUT</h1>
                <h2 className='italic text-2xl xl:text-3xl font-medium'>Good Choice Good Fashion</h2>
              </div>

              <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10 items-center justify-center'>
                <form className='mb-0 space-y-6' action='#' method='POST'>
                  <div>
                    <label for='email' className='block text-sm font-medium text-gray-700'>
                      Email Address
                    </label>
                    <div className='mt-1'>
                      <input type='email' name='email' id='email' autoFocus autoComplete required />
                    </div>
                  </div>
                  <div>
                    <label for='password' className='block text-sm font-medium text-gray-700'>
                      Password
                    </label>
                    <div className='mt-1'>
                      <input type='password' name='password' id='password' required />
                    </div>
                  </div>
                  <div className='text-right mt-2'>
                    <a
                      href='#'
                      className='text-sm font-semibold text-gray-700 hover:text-brand-dark focus:text-brand-dark'
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type='submit'
                    className='w-full block bg-brand hover:bg-brand-light focus:bg-brand-light text-white font-semibold rounded-lg px-4 py-3 mt-6'
                  >
                    Log In
                  </button>
                </form>

                <hr className='my-6 border-gray-300 w-full' />

                <p className='mt-8 text-center font-semibold text-gray-700'>
                  Need an account?{' '}
                  <Link to='/signup' className='text-brand hover:text-brand-dark font-semibold'>
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default withRouter(Signin);
