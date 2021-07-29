import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import Tippy from '@tippyjs/react';
import { SketchPicker } from 'react-color';

import { hideLoader, showLoader } from '../../../actions/LoaderAction';

import TableAction from '../../../components/Table/TableAction';
import TableWrapper from '../../../components/Table/TableWrapper';

import { pageSizes, sortByName } from '../../../data/categoryData';
import { addColor, countColors, countColorsByName, getColors, searchByName } from '../../../services/color.service';

import ERRORS from '../../../constants/Errors';

import { showErrorMessage, showSuccessMessage } from '../../../helpers/showToast';

const headers = (
  <>
    <th className='table-header'>
      <label className='table-header-label'>ID</label>
    </th>
    <th className='table-header'>
      <label className='table-header-label'>Name</label>
    </th>
    <th className='table-header'>
      <label className='table-header-label'>Source</label>
    </th>
    <th className='table-header'>
      <label className='table-header-label justify-around flex'>Action</label>
    </th>
  </>
);

const Color = () => {
  const [colors, setColors] = useState(null);
  const [selectedColor, setSelectedColor] = useState({
    hex: '#FFFFFF',
  });

  const [totalPage, setTotalPage] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState('A-Z');

  const [searchedName, setSearchedName] = useState('');

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(ERRORS.ERR_CATEGORY_NAME_NOT_BLANK).max(50, ERRORS.ERR_CATEGORY_NAME_SIZE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    dispatch(showLoader);

    if (!searchedName || searchedName === '') {
      getColors(pageNum, pageSize, sortBy).then(
        (res) => {
          setColors(res.data.data);
          dispatch(hideLoader);
        },
        (error) => {
          const message =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

          console.log(message);
          dispatch(hideLoader);
        }
      );
    } else {
      setPageNum(1);
      searchByName(1, pageSize, sortBy, searchedName).then((res) => {
        setColors(res.data.data);
        dispatch(hideLoader);
      });
    }
  }, [dispatch, pageNum, pageSize, searchedName, sortBy]);

  useEffect(() => {
    if (pageSize) {
      if (!searchedName || searchedName === '') {
        countColors().then((res) => {
          const pages = _.ceil(res.data.data / pageSize);
          setTotalPage(pages >= 1 ? pages : 1);
        });
      } else {
        countColorsByName(searchedName).then((res) => {
          const pages = _.ceil(res.data.data / pageSize);
          setTotalPage(pages >= 1 ? pages : 1);
        });
      }
    }
  }, [pageSize, searchedName]);

  const handleCreateNew = ({ name }) => {
    dispatch(showLoader);

    addColor(name, selectedColor.hex ? selectedColor.hex : selectedColor)
      .then((res) => {
        showSuccessMessage(res, name, dispatch);
        setPageNum(1);
        reset();
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
    <div className='min-h-screen w-full px-4 pt-4'>
      <div className='section-title w-full p-4'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-col'>
            <div className='text-xs uppercase font-light text-gray-500'>TAB</div>
            <div className='text-2xl font-bold text-brand-dark'>COLOR</div>
          </div>
        </div>
      </div>
      <hr className='mx-4 mb-4 border-dashed border-1 border-brand-light' />

      <div className='lg:flex lg:flex-row'>
        <div className='lg:w-2/3 lg:mx-6'>
          {
            <TableWrapper
              name='COLORS'
              headers={headers}
              rows={
                colors
                  ? colors.map((item, i) => (
                      <tr className='text-left z-9 hover:bg-gray-100' key={item.id}>
                        <td className='table-row-custom'>
                          <span className='table-row-content'>{item.id}</span>
                        </td>
                        <td className='table-row-custom'>
                          <span className='table-row-content'>{item.name}</span>
                        </td>
                        <td className='table-row-custom'>
                          <span className='table-row-content'>{item.source}</span>
                        </td>
                        <td className='table-row-custom flex justify-around'>
                          <TableAction
                            url='/admin/color'
                            itemId={item.id}
                            table='COLOR'
                            list={colors}
                            setList={setColors}
                          />
                        </td>
                      </tr>
                    ))
                  : null
              }
              sorts={
                sortByName &&
                sortByName.map((item, index) => (
                  <option value={item.value} key={item.label}>
                    {item.label}
                  </option>
                ))
              }
              sizes={
                pageSizes &&
                pageSizes.map((item, index) => (
                  <option value={item.value} key={item.label}>
                    {item.label}
                  </option>
                ))
              }
              setPageSize={setPageSize}
              setSortBy={setSortBy}
              pageNum={pageNum}
              setPageNum={setPageNum}
              totalPage={totalPage}
              searchedName={searchedName}
              setSeachedName={setSearchedName}
            />
          }
        </div>

        <hr className='block lg:hidden mx-4 mb-4 mt-20 border-dashed border-1 border-brand-light' />

        <div className='my-16 mx-4 lg:w-1/3 lg:mx-6'>
          <p className='text-xl font-bold mb-3 text-brand-dark flex flex-row items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 mr-3'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z'
              />
            </svg>{' '}
            ADD COLOR
          </p>
          <form
            className='mb-0 grid-cols-2 inline-grid gap-0 space-y-3 lg:mr-16'
            onSubmit={handleSubmit(handleCreateNew)}
          >
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
                    style={{ backgroundColor: selectedColor.hex ? selectedColor.hex : selectedColor }}
                  />
                </Tippy>{' '}
              </div>
            </div>
            <div className='flex flex-row'>
              <button
                type='submit'
                className='block bg-brand-dark hover:bg-brand-darker focus:bg-brand-darker text-white font-semibold rounded-lg px-4 py-3 mt-3'
              >
                Create new
              </button>
              <button
                type='reset'
                className='block bg-gray-400 hover:bg-gray-500 focus:bg-gray-500 font-semibold rounded-lg px-4 py-3 mt-3 ml-3'
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Color;
