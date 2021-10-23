/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../actions/LoaderAction';
import { login } from '../actions/AuthAction';
import ERRORS from '../constants/Errors';
import { showError } from '../helpers/showToast';

const Signin = (props) => {
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

  const handleLogin = ({ email, password }) => {
    dispatch(showLoader());

    dispatch(login(email, password))
      .then(() => {
        const { from } = props.location.state || { from: { pathname: '/' } };
        props.history.push(from);
        window.location.reload();
      })
      .catch((error) => {
        if (error && !error.response) {
          showError('Error: Network Error');
        }

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
          backgroundImage: `url('https://ik.imagekit.io/tnyyngwxvx9/patrick-tomasso-QMDap1TAu0g-unsplash_XafnH-_YX.jpg?updatedAt=1626750231215')`,
        }}
      >
        <div className='container mx-auto'>
          <section className='flex justify-center px-6 py-12'>
            <div className='w-full xl:w-3/4 lg:w-11/12 flex shadow'>
              <div
                className='hidden md:block w-full h-auto md:w-2/3 lg:w-1/2 bg-cover rounded-l-lg bg-center'
                style={{
                  backgroundImage: `url('https://ik.imagekit.io/tnyyngwxvx9/Background/fc7d5755f69adc1fd50cb48f8e7a578e_7h0gsh0ns.jpg')`,
                }}
              ></div>
              <div className='bg-white w-full rounded-r-lg rounded-l-lg md:rounded-l-none md:max-w-md lg:max-w-full lg:w-1/2 h-full px-6 lg:px-16 xl:px-12 flex flex-col'>
                <div className='text-left mt-12 mb-3 px-6 sm:px-10 lg:px-0 xl:mb-6 xl:px-10'>
                  <h1 className='font-bold leading-6 text-brand-dark text-3xl xl:text-4xl '>Chào mừng đến với GUT</h1>
                  <h2 className='italic text-xl xl:text-2xl font-medium'>Good Choice Good Fashion</h2>
                </div>

                <div className='bg-white py-8 px-6 sm:px-10 lg:px-0 xl:px-10'>
                  <div className='flex items-center justify-between mb-8'>
                    <p className='text-xl font-bold text-gray-700'>ĐĂNG NHẬP</p>
                    <p className='text-xs font-thin text-gray-400'>Bắt buộc *</p>
                  </div>

                  <form className='space-y-6' onSubmit={handleSubmit(handleLogin)}>
                    {message && <p className='error-message text-sm'>{message}</p>}
                    <div>
                      <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                        Địa chỉ Email <span className='text-red-500'>*</span>
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
                        Mật khẩu <span className='text-red-500'>*</span>
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
                        Quên mật khẩu?
                      </a>
                    </div>
                    <button
                      type='submit'
                      className='w-full block bg-brand hover:bg-brand-light focus:bg-brand-light text-white font-semibold rounded-lg px-4 py-3 mt-6'
                    >
                      Đăng nhập
                    </button>
                  </form>

                  <hr className='my-6 border-gray-300 w-full' />

                  <p className='mt-8 text-sm text-center font-semibold text-gray-700'>
                    Bạn chưa có tài khoản?{' '}
                    <Link to='/signup' className='text-brand hover:text-brand-dark font-semibold'>
                      Đăng ký
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

export default Signin;
