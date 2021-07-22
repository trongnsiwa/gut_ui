import { Popover } from '@headlessui/react';
import React from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { showLoader } from '../../actions/LoaderAction';
import { showErrorMessage, showSuccessMessage } from '../../helpers/showToast';
import { deleteCategoryParent, deleteChildCategory } from '../../services/category.service';

const TableAction = (props) => {
  const btnRef = useRef();
  const dispatch = useDispatch();

  const deleteItem = (id) => {
    dispatch(showLoader);

    if ('CATEGORY' === props.table) {
      if (props.parent) {
        deleteCategoryParent(id).then(
          (res) => {
            showSuccessMessage(res, id, dispatch);
            if (props.list && props.setList) {
              props.setList(props.list.filter((item) => item.id !== id));
            }
          },
          (error) => {
            showErrorMessage(error, id, dispatch);
          }
        );
      } else {
        deleteChildCategory(id).then(
          (res) => {
            showSuccessMessage(res, id, dispatch);
            props.setList(props.list.filter((item) => item.id !== id));
          },
          (error) => {
            showErrorMessage(error, id, dispatch);
          }
        );
      }
    }
  };

  return (
    <>
      <Link to={`${props.url}/${props.itemId}${props.parent && '?parent=true'}`} className='table-row-content'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 text-green-700'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
          />
        </svg>
      </Link>
      <Popover>
        <Popover.Button ref={btnRef} className='table-row-content'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-red-700'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
        </Popover.Button>
        <div className='relative'>
          <Popover.Panel className='absolute z-10 right-0 w-56 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='flex flex-col justify-center my-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-9 w-9 mx-auto'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
              <p className='text-base font-medium text-gray-900 mx-auto'>Are you sure?</p>
              <div className='p-3 text-center space-x-4 md:block'>
                <button
                  className='mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100'
                  onClick={() => btnRef.current?.click()}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600'
                  onClick={() => {
                    deleteItem(props.itemId);
                    btnRef.current?.click();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Popover.Panel>
        </div>
      </Popover>
    </>
  );
};

export default TableAction;