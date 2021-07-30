import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';

import { hideLoader, showLoader } from '../../../actions/LoaderAction';

import ERRORS from '../../../constants/Errors';

import { showSuccessMessage } from '../../../helpers/showToast';
import { createCategory, createCategoryParent } from '../../../services/category.service';
import { showStoreErrorMessage } from '../../../helpers/setErrorMessage';
import { clearMessage, setMessage } from '../../../actions/MessageAction';

const CreateCategory = () => {
  const [isParent, setIsParent] = useState(false);

  const { message } = useSelector((state) => state.messageReducer);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(ERRORS.ERR_CATEGORY_NAME_NOT_BLANK).max(50, ERRORS.ERR_CATEGORY_NAME_SIZE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
    getValues,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  const handleCreateNew = ({ name, parent, parentId }) => {
    dispatch(showLoader());

    if (parent) {
      createCategoryParent(name)
        .then((res) => {
          showSuccessMessage(res, name, dispatch);
          dispatch(clearMessage());
          reset();
        })
        .catch((error) => {
          showStoreErrorMessage(error, name, dispatch);
        });
    } else {
      if (!parentId) {
        dispatch(setMessage(ERRORS.ERR_PARENT_ID_NOT_NULL));
        dispatch(hideLoader());
        return;
      }

      createCategory(name, parentId)
        .then((res) => {
          showSuccessMessage(res, name, dispatch);
          dispatch(clearMessage());

          reset();
        })
        .catch((error) => {
          const code =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

          var showId = '';
          if (code.includes('PARENT')) {
            showId = parentId;
          } else {
            showId = name;
          }

          showStoreErrorMessage(error, showId, dispatch);
        });
    }
  };

  return (
    <>
      <div className='min-h-screen w-full px-4 pt-4'>
        <div className='section-title w-full p-4'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
              <div className='text-xs uppercase font-light text-gray-500'>TAB</div>
              <div className='text-2xl font-bold text-brand-dark'>CREATE CATEGORY</div>
            </div>
          </div>
        </div>

        <hr className='mx-4 mb-4 border-dashed border-1 border-brand-light' />

        <div className='mt-6 mx-4'>
          <form
            className='mb-0 grid-cols-2 inline-grid gap-0 space-y-6 lg:mr-16'
            onSubmit={handleSubmit(handleCreateNew)}
          >
            {message && <p className='error-message col-span-2'>{message}</p>}
            <div className='flex items-center'>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 '>
                Category name <span className='text-red-500'>*</span>
              </label>
            </div>
            <div className='flex items-center'>
              <div>
                <input
                  className={errors.name && 'error-input'}
                  type='text'
                  name='name'
                  id='name'
                  {...register('name')}
                />
                <p className='error-message'>{errors.name?.message}</p>
              </div>
            </div>
            <div className='flex items-center'>
              <label htmlFor='parent' className='block text-sm font-medium text-gray-700 '>
                Is parent?
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='parent'
                name='parent'
                className={`form-checkbox `}
                {...register('parent')}
                onClick={() => {
                  setValue('parentId', null);
                  setIsParent(!isParent);
                }}
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='parentId' className='block text-sm font-medium text-gray-700'>
                Category parent
              </label>
            </div>
            <div className='flex items-center'>
              <input
                className={errors.parentId && 'error-input'}
                type='text'
                name='parentId'
                id='parentId'
                {...register('parentId')}
                disabled={isParent}
              />
            </div>
            <div className='flex flex-row'>
              <button
                type='submit'
                className={`block text-white font-semibold rounded-lg px-4 py-3 mt-6 ${
                  !isDirty || _.isEmpty(getValues()) || getValues('name') === ''
                    ? 'bg-gray-500 cursor-default'
                    : 'bg-brand-dark hover:bg-brand-darker focus:bg-brand-darker'
                }`}
                disabled={!isDirty || _.isEmpty(getValues()) || getValues('name') === ''}
              >
                Create new
              </button>
              <button
                type='reset'
                className='block bg-gray-400 hover:bg-gray-500 focus:bg-gray-500 font-semibold rounded-lg px-4 py-3 mt-6 ml-3'
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCategory;
