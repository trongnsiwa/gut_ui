import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Tippy from '@tippyjs/react';
import { SketchPicker } from 'react-color';

import ERRORS from '../../../constants/Errors';

import { hideLoader, showLoader } from '../../../actions/LoaderAction';

import { showErrorMessage, showSuccessMessage } from '../../../helpers/showToast';

import { getColor, updateColor } from '../../../services/color.service';

const ColorDetail = (props) => {
  const { id } = props.match.params;

  const [details, setDetails] = useState(null);
  const [selectedColor, setSelectedColor] = useState({
    hex: '#FFFFFF',
  });

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(ERRORS.ERR_CATEGORY_NAME_NOT_BLANK).max(50, ERRORS.ERR_CATEGORY_NAME_SIZE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    dispatch(showLoader);

    getColor(id)
      .then((res) => {
        console.log(res.data.data);
        setDetails(res.data.data);
        dispatch(hideLoader);
      })
      .catch((error) => {
        console.log(error.response.data);
        dispatch(hideLoader);
      });
  }, [dispatch, id]);

  useEffect(() => {
    if (details) {
      setSelectedColor({
        hex: details.source,
      });
    }
  }, [details]);

  const handleSaveChange = ({ name }) => {
    dispatch(showLoader);

    if (!details) {
      return;
    }

    updateColor(id, name, selectedColor?.hex ? selectedColor?.hex : selectedColor)
      .then((res) => {
        showSuccessMessage(res, id, dispatch);
        console.log(res.data.data);
      })
      .catch((error) => {
        const code =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        if (code.includes('SOURCE')) {
          showErrorMessage(error, selectedColor, dispatch);
        } else {
          showErrorMessage(error, name, dispatch);
        }
      });
  };

  return (
    <>
      <div className='min-h-screen w-full px-4 pt-4'>
        <div className='section-title w-full p-4'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
              <div className='text-xs uppercase font-light text-gray-500'>TAB</div>
              <div className='text-2xl font-bold text-brand-dark'>
                COLOR: {details ? details.name.toUpperCase() : id}
              </div>
            </div>
          </div>
        </div>

        <hr className='mx-4 mb-4 border-dashed border-1 border-brand-light' />
        <div className='mt-6 mx-4'>
          {details && (
            <form
              className='mb-0 grid-cols-2 inline-grid gap-0 space-y-6 lg:mr-16'
              onSubmit={handleSubmit(handleSaveChange)}
            >
              <div className='flex items-center'>
                <label htmlFor='id' className='block text-sm font-medium text-gray-700'>
                  ID
                </label>
              </div>
              <div className='flex items-center'>
                <input type='text' name='id' id='id' value={id} disabled={true} />
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
                <Tippy
                  interactive={true}
                  placement={'bottom'}
                  theme={'light-border'}
                  content={
                    <SketchPicker color={selectedColor} onChangeComplete={(color) => setSelectedColor(color.hex)} />
                  }
                >
                  <div
                    className='p-5 w-32 rounded-sm shadow-md inline-block cursor-pointer border-8 border-white'
                    style={{
                      backgroundColor: selectedColor && selectedColor.hex ? selectedColor.hex : selectedColor,
                    }}
                  />
                </Tippy>{' '}
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
          )}
        </div>
      </div>
    </>
  );
};

export default ColorDetail;
