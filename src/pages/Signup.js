/* eslint-disable jsx-a11y/anchor-is-valid */
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { hideLoader, showLoader } from '../actions/LoaderAction';
import ERRORS from '../constants/Errors';
import * as Actions from '../actions/AuthAction';
import MessageModal from '../components/MessageModal';

const Signup = (props) => {
  const signupImage =
    'https://ik.imagekit.io/tnyyngwxvx9/patrick-tomasso-QMDap1TAu0g-unsplash_XafnH-_YX.jpg?updatedAt=1626750231215';

  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.authReducer);
  const { message } = useSelector((state) => state.messageReducer);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(ERRORS.ERR_EMAIL_INVALID).required(ERRORS.ERR_EMAIL_NOT_BLANK),
    password: Yup.string()
      .required(ERRORS.ERR_PASSWORD_NOT_BLANK)
      .test('len', ERRORS.ERR_PASSWORD_SIZE, (val) => {
        if (val) return val.toString().length >= 6 && val.toString().length <= 20;
      }),
    confirm: Yup.string().test('match', ERRORS.ERR_PASSWORD_NOT_MATCH, function (confirm) {
      return confirm === this.parent.password;
    }),
    firstname: Yup.string()
      .required(ERRORS.ERR_FIRSTNAME_NOT_BLANK)
      .test('len', ERRORS.ERR_FIRSTNAME_SIZE, (val) => val.toString().length <= 50),
    lastname: Yup.string()
      .required(ERRORS.ERR_LASTNAME_NOT_BLANK)
      .test('len', ERRORS.ERR_LASTNAME_SIZE, (val) => val.toString().length <= 50),
    terms: Yup.boolean().oneOf([true], ERRORS.ERR_TERMS_AND_CONDITION_NOT_CHECK),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitHandler = ({ email, password, confirm, firstname, lastname }) => {
    dispatch(showLoader());

    dispatch(Actions.register(email, password, confirm, firstname, lastname))
      .then(() => {
        setOpen(true);
        setSuccess(true);
        reset();
        dispatch(hideLoader());
      })
      .catch(() => {
        setSuccess(false);
        dispatch(hideLoader());
      });
  };

  if (isLoggedIn) {
    return <Redirect to='/' />;
  }

  return (
    <>
      <div
        className='mx-auto w-full h-screen bg-cover bg-center'
        style={{
          backgroundImage: `url('${signupImage}')`,
        }}
      >
        <div className='mx-auto py-8 w-11/12 sm:w-3/4 xl:w-2/3'>
          <div className='bg-white py-8 px-6 sm:px-10 items-center justify-start shadow-lg rounded-lg border border-gray-400'>
            <div className='flex w-full justify-between'>
              <div className='w-full lg:w-2/3'>
                <div className='flex items-center justify-between mb-8'>
                  <p className='text-2xl font-bold text-gray-700 text-left'>Register new members</p>
                  <p className='text-base font-thin text-right text-gray-400 lg:mr-16'>
                    Required fields <span className='text-brand-dark'>*</span>
                  </p>
                </div>
                <form className='mb-0 space-y-6 lg:mr-16' onSubmit={handleSubmit(onSubmitHandler)}>
                  {message && !success && <p className='error-message text-sm'>{message}</p>}
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
                        placeholder='xxx@gmail.com'
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
                  <div>
                    <label htmlFor='confirm' className='block text-sm font-medium text-gray-700'>
                      Confirm Password <span className='text-red-500'>*</span>
                    </label>
                    <div className='mt-1'>
                      <input
                        className={errors.confirm && 'error-input'}
                        type='password'
                        name='confirm'
                        id='confirm'
                        {...register('confirm')}
                      />
                      <p className='error-message'>{errors.confirm?.message}</p>
                    </div>
                  </div>
                  <div className='space-y-6'>
                    <div>
                      <label htmlFor='firstname' className='block text-sm font-medium text-gray-700'>
                        First name <span className='text-red-500'>*</span>
                      </label>
                      <div className='mt-1'>
                        <input
                          className={errors.firstname && 'error-input'}
                          type='text'
                          name='firstname'
                          id='firstname'
                          {...register('firstname')}
                        />
                        <p className='error-message'>{errors.firstname?.message}</p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor='lastname' className='block text-sm font-medium text-gray-700'>
                        Last name <span className='text-red-500'>*</span>
                      </label>
                      <div className='mt-1'>
                        <input
                          className={errors.lastname && 'error-input'}
                          type='text'
                          name='lastname'
                          id='lastname'
                          {...register('lastname')}
                        />
                        <p className='error-message'>{errors.lastname?.message}</p>
                      </div>
                    </div>
                  </div>

                  <hr className='my-6 border-gray-300 w-full' />

                  <div>
                    <div className='flex items center'>
                      <input id='terms' name='terms' type='checkbox' {...register('terms')} />
                      <label htmlFor='terms' className='ml-2 block text-sm text-gray-900'>
                        I agree to the{' '}
                        <a href='#' className='text-brand hover:text-brand-light'>
                          Terms
                        </a>{' '}
                        and{' '}
                        <a href='#' className='text-brand hover:text-brand-light'>
                          Conditions
                        </a>
                      </label>
                    </div>
                    <p className='error-message'>{errors.terms?.message}</p>
                  </div>

                  <button
                    type='submit'
                    className='w-full block bg-brand hover:bg-brand-light focus:bg-brand-light text-white font-semibold rounded-lg px-4 py-3 mt-6'
                  >
                    Create new account
                  </button>
                </form>

                <p className='text-left mt-8 font-semibold text-gray-700'>
                  Already registed?{' '}
                  <Link to='/signin' className='text-brand hover:text-brand-dark font-semibold'>
                    Sign In
                  </Link>
                </p>
              </div>
              <div className='hidden mt-12 lg:block w-1/3 justify-end'>
                <img src='https://ik.imagekit.io/tnyyngwxvx9/global_BFA2pdZ1Y.svg?updatedAt=1627317161801' alt=''></img>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      {success && (
        <MessageModal
          message={message}
          action='Close'
          isSuccess={success}
          setSuccess={setSuccess}
          isOpen={open}
          setIsOpen={setOpen}
        />
      )}
    </>
  );
};

export default Signup;
