/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Redirect, withRouter } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../actions/LoaderAction';
import { login } from '../actions/AuthAction';
import ERRORS from '../constants/Errors';

const Signin = (props) => {
  const loginImage = 'https://ik.imagekit.io/tnyyngwxvx9/Background/fc7d5755f69adc1fd50cb48f8e7a578e_7h0gsh0ns.jpg';
  const signupImage =
    'https://ik.imagekit.io/tnyyngwxvx9/patrick-tomasso-QMDap1TAu0g-unsplash_XafnH-_YX.jpg?updatedAt=1626750231215';

  const { isLoggedIn } = useSelector((state) => state.authReducer);
  const { message } = useSelector((state) => state.messageReducer);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(ERRORS.ERR_EMAIL_INVALID).required(ERRORS.ERR_EMAIL_NOT_BLANK),
    password: Yup.string().required(ERRORS.ERR_PASSWORD_NOT_BLANK),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitHandler = ({ email, password }) => {
    dispatch(showLoader());

    dispatch(login(email, password))
      .then(() => {
        const { from } = props.location.state || { from: { pathname: '/' } };
        props.history.push(from);
        window.location.reload();
      })
      .catch(() => {
        dispatch(hideLoader());
      });

    reset();
  };

  if (isLoggedIn) {
    return <Redirect to='/' />;
  }

  return (
    <>
      <div
        className='mx-auto w-full bg-cover bg-center'
        style={{
          backgroundImage: `url('${signupImage}')`,
          height: 'calc(100vh - 80px)',
        }}
      >
        <div className='container mx-auto'>
          <section className='flex justify-center px-6 py-12'>
            <div className='w-full xl:w-3/4 lg:w-11/12 flex shadow'>
              <div
                className='hidden md:block w-full h-auto md:w-2/3 lg:w-1/2 bg-gray-400 bg-cover rounded-l-lg bg-center'
                style={{
                  backgroundImage: `url('${loginImage}')`,
                }}
              ></div>
              <div
                className='bg-white w-full rounded-r-lg rounded-l-lg lg:rounded-l-none md:max-w-md p-5 lg:max-w-full md:1/3 lg:w-1/2 h-full px-6 lg:px-16 xl:px-12
        flex flex-col'
              >
                <div className='text-left mt-12 mb-3 px-6 sm:px-10 lg:px-0 xl:mb-6 xl:px-10'>
                  <h1 className='text-3xl text-brand-dark xl:text-4xl font-bold leading-tight'>Welcome to GUT</h1>
                  <h2 className='italic text-2xl xl:text-3xl font-medium'>Good Choice Good Fashion</h2>
                </div>

                <div className='bg-white py-8 px-6 sm:px-10 lg:px-0 xl:px-10 items-center justify-center'>
                  <div className='flex items-center justify-between mb-8'>
                    <p className='text-xl font-bold text-gray-700 text-left'>LOGIN</p>
                    <p className='text-xs font-thin text-right text-gray-400'>
                      Required fields <span className='text-brand-dark'>*</span>
                    </p>
                  </div>

                  <form className='mb-0 space-y-6' onSubmit={handleSubmit(onSubmitHandler)}>
                    {message && <p className='error-message text-sm'>{message}</p>}
                    <div>
                      <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                        Email Address <span className='text-red-500'>*</span>
                      </label>
                      <div className='mt-1'>
                        <input
                          className={errors.email && 'error-input'}
                          type='text'
                          name='email'
                          id='email'
                          {...register('email')}
                        />
                        <p className='error-message'>{errors.email?.message}</p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                        Password <span className='text-red-500'>*</span>
                      </label>
                      <div className='mt-1'>
                        <input
                          className={errors.password && 'error-input'}
                          type='password'
                          name='password'
                          id='password'
                          {...register('password')}
                        />
                        <p className='error-message'>{errors.password?.message}</p>
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
      </div>
    </>
  );
};

export default withRouter(Signin);
