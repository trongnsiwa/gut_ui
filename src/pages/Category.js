import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../actions/LoaderAction';
import TableAction from '../components/Table/TableAction';
import TableWrapper from '../components/Table/TableWrapper';
import { pageSizes, sortByName } from '../data/categoryData';
import {
  countChildCategories,
  countChildCategoriesWithConditions,
  countParentCategories,
  countParentCategoriesWithConditions,
  getChildCategories,
  getParentCategories,
  searchByName,
} from '../services/category.service';

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
  const [childCategories, setChildCategories] = useState(null);
  const [totalPageP, setTotalPageP] = useState(1);
  const [totalPageC, setTotalPageC] = useState(1);

  const [pageNumP, setPageNumP] = useState(1);
  const [pageSizeP, setPageSizeP] = useState(5);
  const [sortByP, setSortByP] = useState('A-Z');

  const [pageNumC, setPageNumC] = useState(1);
  const [pageSizeC, setPageSizeC] = useState(5);
  const [sortByC, setSortByC] = useState('A-Z');

  const [searchedParentName, setSearchedParentName] = useState('');
  const [searchedChildName, setSeachedChildName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoader);

    if (!searchedParentName || searchedParentName === '') {
      getParentCategories(pageNumP, pageSizeP, sortByP).then(
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
      searchByName(pageNumP, pageSizeP, sortByP, searchedParentName, true).then((res) => {
        setParentCategories(res.data.data);
        dispatch(hideLoader);
      });
    }
  }, [dispatch, pageNumP, pageSizeP, searchedParentName, sortByP]);

  useEffect(() => {
    dispatch(showLoader);

    if (!searchedChildName || searchedChildName === '') {
      getChildCategories(pageNumC, pageSizeC, sortByC).then(
        (res) => {
          console.log(res.data.data);
          setChildCategories(res.data.data);
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
      searchByName(pageNumC, pageSizeC, sortByC, searchedChildName, false).then((res) => {
        setChildCategories(res.data.data);
        dispatch(hideLoader);
      });
    }
  }, [dispatch, pageNumC, pageSizeC, searchedChildName, sortByC]);

  useEffect(() => {
    if (pageSizeP) {
      if (!searchedParentName || searchedParentName === '') {
        countParentCategories().then((res) => {
          const pages = _.ceil(res.data.data / pageSizeP);
          setTotalPageP(pages >= 1 ? pages : 1);
        });
      } else {
        countParentCategoriesWithConditions(searchedParentName).then((res) => {
          const pages = _.ceil(res.data.data / pageSizeP);
          setTotalPageP(pages >= 1 ? pages : 1);
        });
      }
    }
  }, [pageSizeP, searchedParentName]);

  useEffect(() => {
    if (pageSizeC) {
      if (!searchedChildName || searchedChildName === '') {
        countChildCategories().then((res) => {
          console.log(res.data.data);
          const pages = _.ceil(res.data.data / pageSizeC);
          setTotalPageC(pages >= 1 ? pages : 1);
        });
      } else {
        countChildCategoriesWithConditions(searchedChildName).then((res) => {
          const pages = _.ceil(res.data.data / pageSizeC);
          setTotalPageP(pages >= 1 ? pages : 1);
        });
      }
    }
  }, [pageSizeC, searchedChildName]);

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
          name='PARENT CATEGORIES'
          headers={headers}
          rows={
            parentCategories
              ? parentCategories.map((item, i) => (
                  <tr className='text-left' key={item.id}>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>{item.id}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>{item.name}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>N/A</span>
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
          setPageSize={setPageSizeP}
          setSortBy={setSortByP}
          pageNum={pageNumP}
          setPageNum={setPageNumP}
          totalPage={totalPageP}
          searchedName={searchedParentName}
          setSeachedName={setSearchedParentName}
        />
      }

      {
        <TableWrapper
          name='CHILD CATEGORIES'
          headers={headers}
          rows={
            childCategories
              ? childCategories.map((item, i) => (
                  <tr className='text-left' key={item.id}>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>{item.id}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>{item.name}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className='table-row-content'>{item.parentId}</span>
                    </td>
                    <td className='table-row-custom flex justify-around'>
                      <TableAction
                        url='/admin/category'
                        itemId={item.id}
                        table='CATEGORY'
                        parent={false}
                        list={childCategories}
                        setList={setChildCategories}
                      />
                    </td>
                  </tr>
                ))
              : null
          }
          sorts={
            sortByName &&
            sortByName.map((item, index) => (
              <option value={item.value} key={item.label + '1'}>
                {item.label}
              </option>
            ))
          }
          sizes={
            pageSizes &&
            pageSizes.map((item, index) => (
              <option value={item.value} key={item.label + '1'}>
                {item.label}
              </option>
            ))
          }
          setPageSize={setPageSizeC}
          setSortBy={setSortByC}
          pageNum={pageNumC}
          setPageNum={setPageNumC}
          totalPage={totalPageC}
          searchedName={searchedChildName}
          setSeachedName={setSeachedChildName}
        />
      }

      <div className='mb-20'></div>
    </div>
  );
};

export default Category;
