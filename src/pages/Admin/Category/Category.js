import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Transition } from '@headlessui/react';
import _ from 'lodash';

import TableAction from '../../../components/Table/TableAction';
import TableWrapper from '../../../components/Table/TableWrapper';

import { pageSizes, sortByName } from '../../../data/categoryData';

import {
  countByName,
  countByParentAndName,
  countParents,
  getAllParentCategories,
  getCategoryParent,
  getParentCategories,
  searchByName,
  searchByParentAndName,
} from '../../../services/category.service';

const headers = (
  <>
    <th className='table-header'>
      <label className='table-header-label'>Label</label>
    </th>
    <th className='table-header col-span-2'>
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

  const [subCategories, setSubCategories] = useState(null);

  const [filters, setFilters] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!searchedName || searchedName === '') {
      if (!selectedFilter || selectedFilter?.name === 'ALL') {
        getParentCategories(pageNum, pageSize, sortBy).then(
          (res) => {
            setParentCategories(res.data.data);
          },
          (error) => {
            const message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();

            console.log(message);
          }
        );
      } else if (selectedFilter) {
        getCategoryParent(selectedFilter.id).then(
          (res) => {
            setParentCategories([res.data.data]);
          },
          (error) => {
            const message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();

            console.log(message);
          }
        );
      }
    } else {
      if (!selectedFilter || selectedFilter?.name === 'ALL') {
        searchByName(pageNum, pageSize, sortBy, searchedName).then((res) => {
          setParentCategories(null);
          setSearchedCategories(res.data.data);
        });
      } else if (selectedFilter) {
        searchByParentAndName(selectedFilter.id, pageNum, pageSize, sortBy, searchedName).then((res) => {
          setParentCategories(null);
          setSearchedCategories(res.data.data);
        });
      }
    }
  }, [dispatch, pageNum, pageSize, searchedName, selectedFilter, sortBy]);

  useEffect(() => {
    if (pageSize) {
      if (!searchedCategories && parentCategories) {
        if (!selectedFilter || selectedFilter?.name === 'ALL') {
          countParents().then((res) => {
            const pages = _.ceil(res.data.data / pageSize);
            setTotalPage(pages >= 1 ? pages : 1);
          });
        } else if (selectedFilter) {
          setTotalPage(1);
        }
      } else if (searchedCategories) {
        if (!selectedFilter || selectedFilter?.name === 'ALL') {
          countByName(searchedName).then((res) => {
            const pages = _.ceil(res.data.data / pageSize);
            setTotalPage(pages >= 1 ? pages : 1);
          });
        } else if (selectedFilter) {
          countByParentAndName(selectedFilter.id, searchedName).then((res) => {
            const pages = _.ceil(res.data.data / pageSize);
            setTotalPage(pages >= 1 ? pages : 1);
          });
        }
      }
    }
  }, [pageSize, parentCategories, searchedCategories, searchedName, selectedFilter]);

  useEffect(() => {
    if (selectedParent) {
      setSubCategories(selectedParent.subCategories.filter((sub) => !sub.deleted));
    }
  }, [selectedParent]);

  useEffect(() => {
    getAllParentCategories()
      .then((res) => {
        var parentCategories = [
          {
            value: 'ALL',
            label: 'ALL',
          },
        ];
        parentCategories = parentCategories.concat(
          res.data.data.map((cate) => {
            return {
              value: cate.id,
              label: cate.name,
            };
          })
        );
        console.log(parentCategories);

        setFilters(parentCategories);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

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
              ? parentCategories?.map((item, i) => (
                  <React.Fragment key={i}>
                    <tr
                      className={`text-left z-1 hover:bg-gray-100 cursor-pointer ${
                        selectedParent?.id === item.id ? 'bg-indigo-50 rounded-t-lg' : ''
                      }`}
                      key={item.id + '_parent'}
                      onClick={() => {
                        setSelectedParent(item);
                      }}
                    >
                      <td className='table-row-custom'>
                        <span className='table-row-content'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14'
                            />
                          </svg>
                        </span>
                      </td>
                      <td className='table-row-custom col-span-2'>
                        <span
                          className={`table-row-content ${
                            selectedParent?.id === item.id && 'text-brand-dark font-semibold'
                          }`}
                        >
                          {item.id}
                        </span>
                      </td>
                      <td className='table-row-custom'>
                        <span
                          className={`table-row-content ${
                            selectedParent?.id === item.id && 'text-brand-dark font-semibold'
                          }`}
                        >
                          {item.name}
                        </span>
                      </td>
                      <td className='table-row-custom'>
                        <span
                          className={`table-row-content ${
                            selectedParent?.id === item.id && 'text-brand-dark font-semibold'
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

                    {subCategories &&
                      subCategories.map((sub, index) => (
                        <Transition
                          as='tr'
                          className={`text-left hover:bg-gray-100 ${
                            subCategories.length - 1 === index ? 'shadow-lg rounded-lg mt-0' : 'mb-48'
                          }`}
                          key={sub.id + '_sub'}
                          show={selectedParent?.id === item.id}
                          enter='transition-all duration-300'
                          enterFrom='mb-48'
                          enterTo='mt-0'
                          leave='transition-all duration-300'
                          leaveFrom='mt-0'
                          leaveTo='mb-48'
                        >
                          <td className='table-row-custom'>
                            <span className='table-row-content'></span>
                          </td>
                          <td className='table-row-custom col-span-2'>{sub.id}</td>
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
                searchedCategories?.map((item) => (
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
          sorts={sortByName}
          filters={filters}
          sizes={
            pageSizes &&
            pageSizes?.map((item, index) => (
              <option value={item.value} key={item.label}>
                {item.label}
              </option>
            ))
          }
          setPageSize={setPageSize}
          setSortBy={setSortBy}
          setSelectedFilter={setSelectedFilter}
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
