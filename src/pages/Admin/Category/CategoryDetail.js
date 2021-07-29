import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  getCategoryParent,
  getChildCategory,
  updateCategoryNonParentId,
  updateCategoryWithParentId,
  updateParentCategory,
} from '../../../services/category.service';

import ERRORS from '../../../constants/Errors';

import { showLoader } from '../../../actions/LoaderAction';

import TableAction from '../../../components/Table/TableAction';

import { showErrorMessage, showSuccessMessage } from '../../../helpers/showToast';

const CategoryDetail = (props) => {
  const { id } = props.match.params;
  const query = new URLSearchParams(useLocation().search);
  const isParent = query.get('parent');

  const [changed, setChanged] = useState(isParent ? true : false);

  const [details, setDetails] = useState(null);
  const [subCategories, setSubCategories] = useState(null);

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(ERRORS.ERR_CATEGORY_NAME_NOT_BLANK).max(50, ERRORS.ERR_CATEGORY_NAME_SIZE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleSaveChange = ({ name, parent, parentId }) => {
    dispatch(showLoader);

    if (parent) {
      updateParentCategory(id, name)
        .then((res) => {
          showSuccessMessage(res, id, dispatch);
        })
        .catch((error) => {
          showErrorMessage(error, id, dispatch);
        });
    } else {
      if (parentId) {
        updateCategoryWithParentId(id, name, parentId)
          .then((res) => {
            showSuccessMessage(res, id, dispatch);
          })
          .catch((error) => {
            showErrorMessage(error, id, dispatch);
          });
      } else {
        updateCategoryNonParentId(id, name)
          .then((res) => {
            showSuccessMessage(res, id, dispatch);
          })
          .catch((error) => {
            showErrorMessage(error, id, dispatch);
          });
      }
    }
  };

  useEffect(() => {
    if (isParent) {
      getCategoryParent(id)
        .then((res) => {
          console.log(res.data.data);
          setDetails(res.data.data);
          setSubCategories(res.data.data.subCategories);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      getChildCategory(id)
        .then((res) => {
          console.log(res.data.data);
          setDetails(res.data.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }, [id, isParent]);

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
                onSubmit={handleSubmit(handleSaveChange)}
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
                      defaultValue={details.name}
                    />
                    <p className='error-message'>{errors.name?.message}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <label htmlFor='parent' className='block text-sm font-medium text-gray-700 '>
                    Is parent? <span className='text-red-500'>*</span>
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='parent'
                    name='parent'
                    className={`form-checkbox `}
                    {...register('parent')}
                    defaultChecked={changed}
                    onClick={() => {
                      setValue('parentId', null);
                      setChanged(!changed);
                    }}
                    disabled={details.subCategories && details.subCategories.length > 0}
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
                    defaultValue={details.parentId}
                    disabled={changed}
                  />
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

            {subCategories && subCategories.length > 0 && (
              <div className='h-screen'>
                <div className='mt-10 mx-4 overflow-x-auto bg-white rounded-lg shadow overflow-y-visible relative'>
                  <table className='custom-table'>
                    <thead>
                      <tr className='text-left'>
                        <th className='table-header'>
                          <label className='table-header-label'>ID</label>
                        </th>
                        <th className='table-header'>
                          <label className='table-header-label'>Name</label>
                        </th>
                        <th className='table-header'>
                          <label className='table-header-label'>Parent</label>
                        </th>
                        <th className='table-header'>
                          <label className='table-header-label justify-around flex'>Action</label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCategories &&
                        subCategories.map((sub) => (
                          <tr className='text-left hover:bg-gray-100' key={sub.id}>
                            <td className='table-row-custom'>
                              <span className='table-row-content'>{sub.id}</span>
                            </td>
                            <td className='table-row-custom'>
                              <span className='table-row-content'>{sub.name}</span>
                            </td>
                            <td className='table-row-custom'>
                              <span className='table-row-content'>{sub.parentId}</span>
                            </td>
                            <td className='table-row-custom flex justify-around'>
                              <TableAction
                                url='/admin/category'
                                itemId={sub.id}
                                table='CATEGORY'
                                parent={false}
                                isDetail={true}
                                list={subCategories}
                                setList={setSubCategories}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CategoryDetail;
