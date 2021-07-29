import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import TableAction from '../../../components/Table/TableAction';
import TableWrapper from '../../../components/Table/TableWrapper';

import { pageSizes, sorts } from '../../../data/productData';

import {
  countProducts,
  countProductsByName,
  getProducts,
  searchProductsByName,
} from '../../../services/product.service';

const headers = (
  <>
    <th className='table-header'>
      <label className='table-header-label'>ID</label>
    </th>
    <th className='table-header'>
      <label className='table-header-label'>Name</label>
    </th>
    <th className='table-header'>
      <label className='table-header-label'>Price</label>
    </th>
    <th className='table-header'>
      <label className='table-header-label'>Category</label>
    </th>
    <th className='table-header'>
      <label className='table-header-label'>Brand</label>
    </th>
    <th className='table-header'>
      <label className='table-header-label justify-around flex'>Action</label>
    </th>
  </>
);

const Product = () => {
  const [products, setProducts] = useState(null);

  const [totalPage, setTotalPage] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState('A-Z');

  const [searchedName, setSearchedName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (!searchedName || searchedName === '') {
      getProducts(pageNum, pageSize, sortBy).then(
        (res) => {
          setProducts(res.data.data);
        },
        (error) => {
          const message =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

          console.log(message);
        }
      );
    } else {
      searchProductsByName(pageNum, pageSize, sortBy, searchedName).then((res) => {
        setProducts(res.data.data);
      });
    }
  }, [dispatch, pageNum, pageSize, searchedName, sortBy]);

  useEffect(() => {
    if (pageSize) {
      if (!searchedName || searchedName === '') {
        countProducts().then((res) => {
          const pages = _.ceil(res.data.data / pageSize);
          setTotalPage(pages >= 1 ? pages : 1);
        });
      } else {
        countProductsByName(searchedName).then((res) => {
          const pages = _.ceil(res.data.data / pageSize);
          setTotalPage(pages >= 1 ? pages : 1);
        });
      }
    }
  }, [pageSize, searchedName]);

  return (
    <div className='h-screen w-full px-4 pt-4'>
      <div className='section-title w-full p-4'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-col'>
            <div className='text-xs uppercase font-light text-gray-500'>TAB</div>
            <div className='text-2xl font-bold text-brand-dark'>PRODUCT</div>
          </div>
        </div>
      </div>
      <hr className='mx-4 mb-4 border-dashed border-1 border-brand-light' />

      {
        <TableWrapper
          name='PRODUCTS'
          headers={headers}
          rows={
            products
              ? products.map((item, i) => (
                  <tr className={`text-left z-9 hover:bg-gray-100 ${item.deleted ? 'strikeout' : ''}`} key={item.id}>
                    <td
                      className={`table-row-custom 
                   `}
                    >
                      <span className={`table-row-content ${item.salePrice ? 'text-red-600' : ''}`}>{item.id}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className={`table-row-content ${item.salePrice ? 'text-red-600' : ''}`}>{item.name}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className={`table-row-content ${item.salePrice ? 'text-red-600' : ''}`}>{item.price}</span>
                    </td>
                    <td className='table-row-custom'>
                      <span className={`table-row-content ${item.salePrice ? 'text-red-600' : ''}`}>
                        {item.categoryName}
                      </span>
                    </td>
                    <td className='table-row-custom'>
                      <span className={`table-row-content ${item.salePrice ? 'text-red-600' : ''}`}>
                        {item.brandName}
                      </span>
                    </td>
                    <td className='table-row-custom flex justify-around'>
                      <TableAction
                        url='/admin/product'
                        itemId={item.id}
                        table='PRODUCT'
                        list={products}
                        setList={setProducts}
                      />
                    </td>
                  </tr>
                ))
              : null
          }
          sorts={
            sorts &&
            sorts.map((item, index) => (
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

export default Product;
