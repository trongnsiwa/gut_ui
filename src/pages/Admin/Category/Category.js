import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Transition } from '@headlessui/react';
import _ from 'lodash';

import { hideLoader, showLoader } from '../../../actions/LoaderAction';

import TableAction from '../../../components/Table/TableAction';
import TableWrapper from '../../../components/Table/TableWrapper';

import { pageSizes, sortByName } from '../../../data/categoryData';

import {
  countParents,
  countParentsByName,
  getParentCategories,
  searchByName,
} from '../../../services/category.service';

const headers = (
  <>
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
  </>
);

const Category = () => {
  const [parentCategories, setParentCategories] = useState(null);

  const [selectedParent, setSelectedParent] = useState(null);

  const [totalPage, setTotalPage] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState('A-Z');

  const [searchedCategories, setSearchedCategories] = useState(null);
  const [searchedName, setSearchedName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoader);

    if (!searchedName || searchedName === '') {
      getParentCategories(pageNum, pageSize, sortBy).then(
        (res) => {
          setParentCategories(res.data.data);
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
      searchByName(pageNum, pageSize, sortBy, searchedName).then((res) => {
        setParentCategories(null);
        setSearchedCategories(res.data.data);
        dispatch(hideLoader);
      });
    }
  }, [dispatch, pageNum, pageSize, searchedName, sortBy]);

  useEffect(() => {
    if (pageSize) {
      if (!searchedCategories && parentCategories) {
        countParents().then((res) => {
          const pages = _.ceil(res.data.data / pageSize);
          setTotalPage(pages >= 1 ? pages : 1);
        });
      } else if (searchedCategories) {
        countParentsByName(searchedName).then((res) => {
          const pages = _.ceil(res.data.data / pageSize);
          setTotalPage(pages >= 1 ? pages : 1);
        });
      }
    }
  }, [pageSize, parentCategories, searchedCategories, searchedName]);

  return (
    <div className='min-h-screen w-full px-4 pt-4'>
      <div className='section-title w-full p-4'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-col'>
            <div className='text-xs uppercase font-light text-gray-500'>TAB</div>
            <div className='text-2xl font-bold text-brand-dark'>CATEGORIES</div>
          </div>
        </div>
      </div>
      <hr className='mx-4 mb-4 border-dashed border-1 border-brand-light' />
      {
        <TableWrapper
          name='CATEGORIES'
          headers={headers}
          rows={
            parentCategories
              ? parentCategories.map((item, i) => (
                  <React.Fragment key={i}>
                    <tr
                      className={`text-left z-1 hover:bg-gray-100 cursor-pointer ${
                        selectedParent === item.id ? 'bg-gray-100' : ''
                      }`}
                      key={item.id + '_parent'}
                      onClick={() => {
                        setSelectedParent(item.id);
                      }}
                    >
                      <td className='table-row-custom'>
                        <span
                          className={`table-row-content ${
                            selectedParent === item.id && 'text-brand-dark font-semibold'
                          }`}
                        >
                          {item.id}
                        </span>
                      </td>
                      <td className='table-row-custom'>
                        <span
                          className={`table-row-content ${
                            selectedParent === item.id && 'text-brand-dark font-semibold'
                          }`}
                        >
                          {item.name}
                        </span>
                      </td>
                      <td className='table-row-custom'>
                        <span
                          className={`table-row-content ${
                            selectedParent === item.id && 'text-brand-dark font-semibold'
                          }`}
                        >
                          N/A
                        </span>
                      </td>
                      <td className='table-row-custom flex justify-around'>
                        <TableAction
                          url='/admin/category'
                          itemId={item.id}
                          table='CATEGORY'
                          parent={true}
                          list={parentCategories}
                          setList={setParentCategories}
                        />
                      </td>
                    </tr>

                    {item.subCategories &&
                      item.subCategories.map((sub) => (
                        <Transition
                          as='tr'
                          className={`text-left hover:bg-gray-100 ${
                            selectedParent === item.id ? 'shadow-lg  rounded-lg mt-0' : 'mb-48'
                          }`}
                          key={sub.id + '_sub'}
                          show={selectedParent === item.id}
                          enter='transition-all duration-300'
                          enterFrom='mb-48'
                          enterTo='mt-0'
                          leave='transition-all duration-300'
                          leaveFrom='mt-0'
                          leaveTo='mb-48'
                        >
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
                              list={parentCategories}
                              setList={setParentCategories}
                            />
                          </td>
                        </Transition>
                      ))}
                  </React.Fragment>
                ))
              : searchedCategories &&
                searchedCategories.map((item) => (
                  <tr className='text-left hover:bg-gray-100 cursor-pointer' key={item.id + '_searched'}>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>{item.id}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>{item.name}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>{item.parentId ? item.parentId : 'N/A'}</span>
                    </td>
                    <td className='table-row-custom flex justify-around'>
                      <TableAction
                        url='/admin/category'
                        itemId={item.id}
                        table='CATEGORY'
                        parent={item.parentId === null}
                        isSearch={searchedName && searchByName !== ''}
                        list={searchedCategories}
                        setList={setSearchedCategories}
                      />
                    </td>
                  </tr>
                ))
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
  );
};

export default Category;
