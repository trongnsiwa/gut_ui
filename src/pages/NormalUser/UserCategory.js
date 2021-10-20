import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  FlagIcon,
  ScaleIcon,
  SparklesIcon,
} from '@heroicons/react/outline';
import _ from 'lodash';

import { priceTypes, sortsForUser } from '../../data/productData';

import { capitalizeFirstLetter, lowerCaseString } from '../../helpers/formatString';

import { getAllParentCategories } from '../../services/category.service';
import {
  countProductsByCategory,
  countProductsByCategoryAndName,
  getProductsByCategory,
  searchProductsByCategoryAndName,
} from '../../services/product.service';
import { getALlColors } from '../../services/color.service';
import { getALlSizes } from '../../services/size.service';

import ItemBox from '../../components/ItemBox';
import Spinner from '../../components/Spinner';

import { Role } from '../../constants/Role';

const UserCategory = (props) => {
  const { slug, parent } = props.match.params;
  const { id, parentId } = props.location.state;

  const location = useLocation();
  let query = new URLSearchParams(location.search);
  const saleTypes = query.get('saleTypes');
  const colorIds = query.get('colorIds');
  const sizeIds = query.get('sizeIds');
  const fromPrice = query.get('fromPrice');
  const toPrice = query.get('toPrice');

  const [parentCategories, setParentCategories] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [products, setProducts] = useState(null);
  const [colors, setColors] = useState(null);
  const [sizes, setSizes] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sortBy, setSortBy] = useState('CHEAPEST');
  const [searchedName, setSearchedName] = useState('');

  const [totalResults, setTotalResults] = useState(null);
  const [pageNumbers, setPageNumbers] = useState(0);
  const [currentPageNumbers, setCurrentPageNumbers] = useState();

  const { user: currentUser } = useSelector((state) => state.authReducer);
  const history = useHistory();

  if (currentUser && currentUser.roles?.includes(Role.ADMIN)) {
    history.push('/admin');
    window.location.reload();
  }

  useEffect(() => {
    getAllParentCategories().then(
      (res) => {
        setParentCategories(res.data.data);
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        console.log(message);
      }
    );
  }, []);

  useEffect(() => {
    getALlColors().then(
      (res) => {
        setColors(res.data.data);
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        console.log(message);
      }
    );
  }, []);

  useEffect(() => {
    getALlSizes().then(
      (res) => {
        setSizes(res.data.data);
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        console.log(message);
      }
    );
  }, []);

  useEffect(() => {
    if (!searchedName || searchedName === '') {
      getProductsByCategory(
        id ? id : parentId,
        pageNum,
        pageSize,
        sortBy,
        saleTypes,
        colorIds,
        sizeIds,
        fromPrice,
        toPrice
      ).then(
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
      searchProductsByCategoryAndName(
        id ? id : parentId,
        pageNum,
        pageSize,
        sortBy,
        searchedName,
        saleTypes,
        colorIds,
        sizeIds,
        fromPrice,
        toPrice
      ).then((res) => {
        setProducts(res.data.data);
      });
    }
  }, [colorIds, fromPrice, id, pageNum, pageSize, parentId, saleTypes, searchedName, sizeIds, sortBy, toPrice]);

  useEffect(() => {
    if (pageSize) {
      if (!searchedName || searchedName === '') {
        countProductsByCategory(id ? id : parentId, saleTypes, colorIds, sizeIds, fromPrice, toPrice).then((res) => {
          const pages = _.ceil(res.data.data / pageSize);
          setTotalPages(pages >= 1 ? pages : 1);
        });
      } else {
        countProductsByCategoryAndName(
          id ? id : parentId,
          searchedName,
          saleTypes,
          colorIds,
          sizeIds,
          fromPrice,
          toPrice
        ).then((res) => {
          const pages = _.ceil(res.data.data / pageSize);
          setTotalPages(pages >= 1 ? pages : 1);
        });
      }
    }
  }, [colorIds, fromPrice, id, pageSize, parentId, saleTypes, searchedName, sizeIds, toPrice]);

  useEffect(() => {
    if (!searchedName || searchedName === '') {
      countProductsByCategory(id ? id : parentId, saleTypes, colorIds, sizeIds, fromPrice, toPrice).then((res) => {
        setTotalResults(res.data.data);
      });
    } else {
      countProductsByCategoryAndName(
        id ? id : parentId,
        searchedName,
        saleTypes,
        colorIds,
        sizeIds,
        fromPrice,
        toPrice
      ).then((res) => {
        setTotalResults(res.data.data);
      });
    }
  }, [colorIds, fromPrice, id, parentId, saleTypes, searchedName, sizeIds, toPrice]);

  useEffect(() => {
    if (totalPages) {
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      setPageNumbers(pageNumbers);
    }
  }, [totalPages]);

  useEffect(() => {
    if (pageNum && pageNumbers) {
      setCurrentPageNumbers(pageNumbers.slice(0, 5));
    }
  }, [pageNum, pageNumbers]);

  const removeFromQueryParam = (param, name, value) => {
    const lastIndexOfName = param.lastIndexOf(name);
    const indexOfValue = param.indexOf(value);

    if (indexOfValue - 1 === lastIndexOfName) {
      return param.replace(param.slice(indexOfValue, indexOfValue + value.length + 1), '');
    }

    return param.replace(param.slice(indexOfValue - 1, indexOfValue + value.length), '');
  };

  const filterSaleTypes = (e, isClear) => {
    let search = '';
    if (!isClear) {
      if (!saleTypes) {
        search = `${query.toString().length === 0 ? '?' : query.toString() + '&'}saleTypes=${lowerCaseString(
          e.target.value
        )}`;
      } else {
        query.set('saleTypes', saleTypes + ',' + lowerCaseString(e.target.value));
        search = query.toString();
      }
    } else {
      if (saleTypes.replace(lowerCaseString(e.target.value), '').length === 0) {
        query.delete('saleTypes');
        search = query.toString();
      } else {
        query.set('saleTypes', removeFromQueryParam(saleTypes, 'saleTypes', lowerCaseString(e.target.value)));
        search = query.toString();
      }
    }

    history.push({
      pathname: location.pathname,
      search: search,
      state: location.state,
    });
  };

  const filterColor = (e, isClear) => {
    let search = '';
    if (!isClear) {
      if (!colorIds) {
        search = `${query.toString().length === 0 ? '?' : query.toString() + '&'}colorIds=${e.target.value}`;
      } else {
        query.set('colorIds', colorIds + ',' + e.target.value);
        search = query.toString();
      }
    } else {
      if (colorIds.replace(e.target.value, '').length === 0) {
        query.delete('colorIds');
        search = query.toString();
      } else {
        query.set('colorIds', removeFromQueryParam(colorIds, 'colorIds', e.target.value));
        search = query.toString();
      }
    }

    history.push({
      pathname: location.pathname,
      search: search,
      state: location.state,
    });
  };

  const filterSize = (e, isClear) => {
    let search = '';
    if (!isClear) {
      if (!sizeIds) {
        search = `${query.toString().length === 0 ? '?' : query.toString() + '&'}sizeIds=${e.target.value}`;
      } else {
        query.set('sizeIds', sizeIds + ',' + e.target.value);
        search = query.toString();
      }
    } else {
      if (sizeIds.replace(e.target.value, '').length === 0) {
        query.delete('sizeIds');
        search = query.toString();
      } else {
        query.set('sizeIds', removeFromQueryParam(sizeIds, 'sizeIds', e.target.value));
        search = query.toString();
      }
    }

    history.push({
      pathname: location.pathname,
      search: search,
      state: location.state,
    });
  };

  const filterPrice = (from, to, isClear) => {
    let search = '';
    if (!isClear) {
      if (!fromPrice) {
        search = `${query.toString().length === 0 ? '?' : query.toString() + '&'}fromPrice=${from}${
          to ? '&toPrice=' + to : ''
        }`;
      } else {
        query.set('fromPrice', from);
        query.delete('toPrice');
        if (to) {
          query.set('toPrice', to);
        }

        search = query.toString();
      }
    } else {
      query.delete('fromPrice');
      query.delete('toPrice');
      search = query.toString();
    }

    history.push({
      pathname: location.pathname,
      search: search,
      state: location.state,
    });
  };

  return (
    <div className='my-10 h-full w-full px-6 lg:px-14 lg:mx-auto lg:container'>
      <nav className='text-gray-600 my-8' aria-label='Breadcrumb'>
        <ol className='list-none p-0 inline-flex'>
          <li className='flex items-center'>
            <Link to='/'>Trang chủ</Link>
            <svg className='fill-current w-3 h-3 mx-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
              <path d='M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z' />
            </svg>
          </li>
          <li className='flex items-center'>
            <Link
              to={{
                pathname: `/category/${parent}`,
                search: location.search,
                state: {
                  parentId,
                },
              }}
            >
              {parent}
            </Link>
            {id && (
              <svg className='fill-current w-3 h-3 mx-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
                <path d='M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z' />
              </svg>
            )}
          </li>
          {id && (
            <li>
              <Link
                to={{
                  pathname: `/category/${parent}/${slug}`,
                  search: location.search,
                  state: {
                    id,
                    parentId,
                  },
                }}
                aria-current='page'
              >
                {slug}
              </Link>
            </li>
          )}
        </ol>
      </nav>

      <div className='mt-10'>
        <h1 className='text-2xl font-bold'>{capitalizeFirstLetter(slug ? slug : parent)}</h1>
        <span className='text-xl text-gray-400'>{slug ? slug.toUpperCase() : parent.toUpperCase()}</span>
      </div>

      <div className='flex justify-between w-full my-6 mt-20'>
        <section className='relative flex flex-col p-0'>
          <div className='flex w-full h-10 items-center justify-start border-b border-gray-200 border-solid'>
            <span className='text-sm md:text-base font-semibold'>DANH MỤC</span>
          </div>
          <div className='py-3 text-sm md:text-base'>
            {parentCategories &&
              parentCategories?.map(
                (parent) =>
                  !parent.deleted && (
                    <div className='mr-3 md:mr-0' key={parent.id}>
                      <div className='flex w-full items-center'>
                        <div className='space-y-5'>
                          <Link
                            to={{
                              pathname: `/category/${parent.name.toString().toLowerCase()}`,
                              search: location.search,
                              state: {
                                parentId: parent.id,
                              },
                            }}
                            onClick={() => setPageNum(1)}
                          >
                            {parent.name}
                          </Link>
                          <div className='inline-flex pl-3'>
                            <button
                              type='button'
                              onClick={() => {
                                if (selectedParent?.id === parent.id) {
                                  setSelectedParent(null);
                                  return;
                                }
                                setSelectedParent(parent);
                              }}
                            >
                              {selectedParent?.id === parent.id ? (
                                <ChevronDownIcon className='h-4 w-4' />
                              ) : (
                                <ChevronRightIcon className='h-4 w-4' />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex flex-col space-y-5 my-5 ml-6 ${
                          selectedParent?.id === parent.id ? '' : 'hidden'
                        }`}
                      >
                        {parent.subCategories &&
                          parent?.subCategories?.map(
                            (sub) =>
                              !sub.deleted && (
                                <Link
                                  to={{
                                    pathname: `/category/${lowerCaseString(parent.name)}/${sub.name
                                      .toString()
                                      .toLowerCase()}`,
                                    search: location.search,
                                    state: {
                                      id: sub.id,
                                      parentId: parent.id,
                                    },
                                  }}
                                  onClick={() => setPageNum(1)}
                                  key={sub.id}
                                >
                                  {sub.name}
                                </Link>
                              )
                          )}
                      </div>
                    </div>
                  )
              )}
          </div>
          <div className='py-6 border-t mt-6 border-gray-200 border-solid'>
            <div className='flex w-full items-center'>
              <FlagIcon className='h-6 w-6 text-gray-700' />
              <span className='font-semibold flex-grow pl-2 text-sm md:text-base'>Loại sản phẩm</span>
            </div>
            <div className='flex flex-col mt-3'>
              {[...Array.from(['Mới', 'Giảm giá'])].map((type, index) => (
                <div className='relative py-2' key={`type_${type}`}>
                  <label className='inline-flex flex-row items-center'>
                    <input
                      type='checkbox'
                      value={type}
                      className='w-4 h-4 md:w-5 md:h-5 cursor-pointer'
                      defaultChecked={saleTypes && saleTypes.includes(lowerCaseString(type))}
                      onChange={(e) => {
                        if (saleTypes && saleTypes.includes(lowerCaseString(type))) {
                          filterSaleTypes(e, true);
                        } else {
                          filterSaleTypes(e, false);
                        }
                        setPageNum(1);
                      }}
                    />
                    <span className='pl-3 text-sm md:text-base'>{type}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className='py-6 border-t border-gray-200 border-solid'>
            <div className='flex w-full items-center'>
              <SparklesIcon className='h-6 w-6 text-gray-700' />
              <span className='font-semibold flex-grow pl-2 text-sm md:text-base'>Màu sắc</span>
            </div>
            <div className='flex flex-col mt-6'>
              <div className='grid gap-2' style={{ gridTemplateColumns: 'repeat(auto-fill, 36px)' }}>
                {colors &&
                  colors?.map(
                    (color, index) =>
                      index <= 11 && (
                        <label
                          className='cursor-pointer w-6 h-6 md:w-8 md:h-8 rounded-full relative hover:border-3 hover:border-black hover:shadow-lg hover:p-3'
                          style={{
                            backgroundColor: `${color?.source}`,
                          }}
                          key={`color_${color.id}`}
                        >
                          <input
                            type='checkbox'
                            className='absolute opacity-0 w-0 h-0 cursor-pointer'
                            value={color.id}
                            onChange={(e) => {
                              if (
                                colorIds &&
                                colorIds
                                  .toString()
                                  .split(',')
                                  .map((x) => +x)
                                  .indexOf(parseInt(color.id, 10)) >= 0
                              ) {
                                filterColor(e, true);
                              } else {
                                filterColor(e, false);
                              }
                              setPageNum(1);
                            }}
                          />
                          <span
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                              colorIds
                                ?.toString()
                                .split(',')
                                .map((x) => +x)
                                .indexOf(parseInt(color.id, 10)) >= 0
                                ? 'block'
                                : 'hidden'
                            }
                          }`}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-6 w-6 text-gray-600'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                            </svg>
                          </span>
                        </label>
                      )
                  )}
              </div>
            </div>
          </div>
          <div className='py-6 border-t border-gray-200 border-solid mt-3'>
            <div className='flex w-full items-center'>
              <ScaleIcon className='h-6 w-6 text-gray-700' />
              <span className='font-semibold flex-grow pl-2 text-sm md:text-base'>Kích cỡ</span>
            </div>
            <div className='flex flex-col mt-6'>
              <div className='grid gap-4' style={{ gridTemplateColumns: 'repeat(auto-fill, 36px)' }}>
                {sizes &&
                  sizes?.map(
                    (size, index) =>
                      index < 7 && (
                        <label
                          className={`mr-3 mb-1 cursor-pointer text-base box-border inline-flex justify-center items-center align-middle relative border border-solid border-gray-600 p-5 hover:bg-brand-dark hover:text-white 
                          ${
                            sizeIds
                              ?.toString()
                              .split(',')
                              .map((x) => +x)
                              .indexOf(parseInt(size.id, 10)) >= 0
                              ? 'bg-brand-dark text-white'
                              : ''
                          }
                          `}
                          key={`size_${size.id}`}
                        >
                          <input
                            type='checkbox'
                            className='absolute opacity-0 w-0 h-0 cursor-pointer'
                            value={size.id}
                            onChange={(e) => {
                              if (
                                sizeIds &&
                                sizeIds
                                  .toString()
                                  .split(',')
                                  .map((x) => +x)
                                  .indexOf(parseInt(size.id, 10)) >= 0
                              ) {
                                filterSize(e, true);
                              } else {
                                filterSize(e, false);
                              }
                              setPageNum(1);
                            }}
                          />
                          <span className='absolute '>{size.name}</span>
                        </label>
                      )
                  )}
              </div>
            </div>
          </div>
          <div className='py-6 border-t mt-6 border-gray-200 border-solid'>
            <div className='flex w-full items-center'>
              <CurrencyDollarIcon className='h-6 w-6 text-gray-700' />
              <span className='font-semibold flex-grow pl-2 text-sm md:text-base'>Giá cả</span>
            </div>
            <div className='flex flex-col mt-3'>
              {priceTypes.map((type, index) => (
                <div className='relative py-2' key={`price${index}`}>
                  <label className='inline-flex flex-row items-center'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 md:w-5 md:h-5 cursor-pointer'
                      onChange={() => {
                        if (parseInt(fromPrice) === type.from) {
                          filterPrice(type.from, type.to, true);
                        } else {
                          filterPrice(type.from, type.to, false);
                        }
                        setPageNum(1);
                      }}
                      disabled={fromPrice && parseInt(fromPrice, 10) !== type.from ? true : false}
                    />
                    <span className='pl-3 text-sm md:text-base'>{type.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className='relative ml-6' style={{ width: '858px' }}>
          <div className='flex w-full justify-between my-3'>
            <div className='pr-4 w-full md:w-2/5'>
              <div className='relative'>
                <input
                  type='text'
                  className='w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-600 font-medium'
                  placeholder='Tìm sản phẩm theo tên...'
                  value={searchedName}
                  onChange={(e) => {
                    setSearchedName(e.target.value);
                    setPageNum(1);
                  }}
                />

                <div className='absolute top-0 left-0 inline-flex items-center p-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-6 h-6 text-gray-400'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect x='0' y='0' width='24' height='24' stroke='none'></rect>
                    <circle cx='10' cy='10' r='7' />
                    <line x1='21' y1='21' x2='15' y2='15' />
                  </svg>
                </div>
              </div>
            </div>

            <select
              className='form-select text-gray-600 font-medium w-1/4 bg-white focus:outline-none focus:shadow-outline flex'
              onChange={(e) => {
                setPageNum(1);
                setSortBy(e.target.value);
              }}
            >
              {sortsForUser &&
                sortsForUser.map((item, index) => (
                  <option value={item.value} key={`_${item.label}`}>
                    {item.label}
                  </option>
                ))}
            </select>
          </div>
          <div className='flex w-full'>
            <div className='w-full'>
              <div className='list-none p-0 m-0 grid grid-cols-2 md:grid-cols-4'>
                {!products ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  products?.map(
                    (product) =>
                      !product.deleted && (
                        <ItemBox
                          item={product}
                          key={product.id}
                          parent={{
                            id: parentId,
                            name: parent,
                          }}
                          category={{
                            id: id,
                            name: slug,
                          }}
                        />
                      )
                  )
                )}
                {searchedName && (!products || products?.length === 0) && (
                  <div className='w-full col-span-2 md:col-span-4 shadow-lg rounded-md my-5'>
                    <div className='flex flex-col justify-center items-center w-full my-6 bg-white px-4 sm:px-6 lg:px-16'>
                      <img
                        src='https://ik.imagekit.io/tnyyngwxvx9/no-results_sbm3UFZiL.svg?updatedAt=1626878273006'
                        alt='Not Found'
                        className='h-16 w-16 mx-auto mb-4 text-gray-900'
                      />
                      <p className='text-base leading-5 font-medium text-gray-900 mb-3'>Không tìm thấy kết quả</p>
                      <p className='text-sm'>
                        Không tìm thấy bất kì sản phẩm nào có tên "{searchedName}" theo tìm kiếm của bạn.
                      </p>
                    </div>
                  </div>
                )}
                {!searchedName && (!products || products?.length === 0) && (
                  <div className='w-full col-span-2 md:col-span-4 shadow-lg rounded-md my-5'>
                    <div className='flex flex-col justify-center items-center w-full my-6 bg-white px-4 sm:px-6 lg:px-16'>
                      <img
                        src='https://ik.imagekit.io/tnyyngwxvx9/no-results_sbm3UFZiL.svg?updatedAt=1626878273006'
                        alt='Not Found'
                        className='h-16 w-16 mx-auto mb-4 text-gray-900'
                      />
                      <p className='text-base leading-5 font-medium text-gray-900 mb-3'>Không tìm thấy kết quả</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Hiển thị <span className='font-medium'>{pageNumbers && pageNumbers[0]}</span> đến{' '}
                <span className='font-medium'>{pageNumbers && pageNumbers[pageNumbers.length - 1]}</span> trong{' '}
                <span className='font-medium'>{totalResults}</span> tổng kết quả
              </p>
            </div>
            <div>
              <nav className='z-0 inline-flex rounded-md shadow-sm -space-x-px' aria-label='Pagination'>
                <button
                  className='inline-flex items-center md:px-2 md:py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                  onClick={() => {
                    if (pageNum === currentPageNumbers[0] && pageNum !== 1) {
                      setCurrentPageNumbers(pageNumbers.slice(pageNum - 5, pageNum));
                    }
                    setPageNum(pageNum - 1);
                  }}
                  disabled={pageNum === 1}
                  key='start'
                >
                  <span className='sr-only'>Previous</span>
                  <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
                </button>
                {currentPageNumbers &&
                  currentPageNumbers.map((num, index) => (
                    <button
                      aria-current='page'
                      className={`z-10 ${
                        pageNum === num
                          ? 'bg-indigo-50 border-brand-light text-brand-dark'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } relative inline-flex items-center px-2 md:px-4 py-2 border text-sm font-medium`}
                      onClick={() => {
                        if (index === currentPageNumbers.length - 1 && pageNum < totalPages) {
                          setCurrentPageNumbers(pageNumbers.slice(pageNum, pageNum + 5));
                        } else if (index === currentPageNumbers[0] - 1 && pageNum !== 1) {
                          setCurrentPageNumbers(pageNumbers.slice(pageNum - 5, pageNum));
                        }
                        setPageNum(num);
                      }}
                      key={index}
                    >
                      {num}
                    </button>
                  ))}
                <button
                  className='inline-flex items-center md:px-2 md:py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                  onClick={() => {
                    if (pageNum === currentPageNumbers[currentPageNumbers.length - 1] && pageNum < totalPages) {
                      setCurrentPageNumbers(pageNumbers.slice(pageNum, pageNum + 5));
                    }
                    setPageNum(pageNum + 1);
                  }}
                  disabled={pageNum === totalPages}
                  key='last'
                >
                  <span className='sr-only'>Next</span>
                  <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
                </button>
              </nav>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserCategory;
