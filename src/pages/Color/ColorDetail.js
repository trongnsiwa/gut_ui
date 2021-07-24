import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import ERRORS from '../../constants/Errors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showLoader } from '../../actions/LoaderAction';
import { showErrorMessage, showSuccessMessage } from '../../helpers/showToast';
import { getColor, updateColor } from '../../services/color.service';

const ColorDetail = (props) => {
  const { id } = props.match.params;

  const [details, setDetails] = useState(null);

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(ERRORS.ERR_CATEGORY_NAME_NOT_BLANK).max(50, ERRORS.ERR_CATEGORY_NAME_SIZE),
    source: Yup.string().required(ERRORS.ERR_COLOR_SOURCE_NOT_BLANK),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitHandler = ({ name, source }) => {
    dispatch(showLoader());
    updateColor(id, name, source)
      .then((res) => {
        showSuccessMessage(res, id, dispatch);
      })
      .catch((error) => {
        showErrorMessage(error, id, dispatch);
      });
  };

  useEffect(() => {
    getColor(id)
      .then((res) => {
        console.log(res.data.data);
        setDetails(res.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, [id]);

  return (
    <>
      <div className='min-h-screen w-full px-4 pt-4'>
        <div className='section-title w-full p-4'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
              <div className='text-xs uppercase font-light text-gray-500'>TAB</div>
              <div className='text-2xl font-bold text-brand-dark'>
                CATEGORY: {details ? details.name.toUpperCase() : id}
              </div>
            </div>
          </div>
        </div>

        <hr className='mx-4 mb-4 border-dashed border-1 border-brand-light' />

        {details && (
          <>
            <div className='mt-6 mx-4'>
              <form
                className='mb-0 grid-cols-2 inline-grid gap-0 space-y-6 lg:mr-16'
                onSubmit={handleSubmit(onSubmitHandler)}
              >
                <div className='flex items-center'>
                  <label htmlFor='id' className='block text-sm font-medium text-gray-700'>
                    ID
                  </label>
                </div>
                <div className='flex items-center'>
                  <input type='text' name='id' id='id' {...register('id')} value={id} disabled={true} />
                </div>
                <div className='flex items-center'>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-700 '>
                    Color name <span className='text-red-500'>*</span>
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
                      defaultValue={details.name}
                    />
                    <p className='error-message'>{errors.name?.message}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <label htmlFor='parentId' className='block text-sm font-medium text-gray-700'>
                    Color source <span className='text-red-500'>*</span>
                  </label>
                </div>
                <div className='flex items-center'>
                  <div>
                    <input
                      className={errors.source && 'error-input'}
                      type='text'
                      name='source'
                      id='source'
                      {...register('source')}
                    />
                    <p className='error-message'>{errors.source?.message}</p>
                  </div>
                </div>
                <div className='flex flex-row'>
                  <button
                    type='submit'
                    className='block bg-brand-dark hover:bg-brand-darker focus:bg-brand-darker text-white font-semibold rounded-lg px-4 py-3 mt-6'
                  >
                    Save change
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
          </>
        )}
      </div>
    </>
  );
};

export default ColorDetail;
