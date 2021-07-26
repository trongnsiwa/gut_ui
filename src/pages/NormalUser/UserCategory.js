import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { hideLoader, showLoader } from '../../actions/LoaderAction';
import { sortsForUser } from '../../data/productData';
import { capitalizeFirstLetter, lowerCaseString } from '../../helpers/String';
import { getAllParentCategories } from '../../services/category.service';
import { countProductsByCategory, getProductsByCategory } from '../../services/product.service';
import _ from 'lodash';
import ItemBox from '../../components/ItemBox';

const UserCategory = (props) => {
  const { slug, parent } = props.match.params;
  const { id, parentId } = props.location.state;

  const [parentCategories, setParentCategories] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [products, setProducts] = useState(null);

  const [totalPage, setTotalPage] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [sortBy, setSortBy] = useState('CHEAPEST');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoader);

    getAllParentCategories().then(
      (res) => {
        setParentCategories(res.data.data);
        console.log(res.data.data);
        dispatch(hideLoader);
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        console.log(message);
        dispatch(hideLoader);
      }
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(showLoader);

    getProductsByCategory(id ? id : parentId, pageNum, pageSize, sortBy).then(
      (res) => {
        setProducts(res.data.data);
        dispatch(hideLoader);
        console.log(res.data.data);
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        console.log(message);
        dispatch(hideLoader);
      }
    );
  }, [dispatch, id, pageNum, pageSize, parentId, sortBy]);

  useEffect(() => {
    if (pageSize) {
      countProductsByCategory(id ? id : parentId).then((res) => {
        const pages = _.ceil(res.data.data / pageSize);
        setTotalPage(pages >= 1 ? pages : 1);
      });
    }
  }, [id, pageSize, parentId]);

  return (
    <div className='my-10 w-full h-screen px-14 lg:mx-0 lg:container'>
      <nav className='text-gray-600 my-8' aria-label='Breadcrumb'>
        <ol className='list-none p-0 inline-flex'>
          <li className='flex items-center'>
            <Link to='/'>Home</Link>
            <svg className='fill-current w-3 h-3 mx-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
              <path d='M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z' />
            </svg>
          </li>
          <li className='flex items-center'>
            <Link
              to={{
                pathname: `/category/${parent}`,
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

      <div className='flex w-full justify-between list-none my-6 mt-20'>
        <section className='relative flex flex-col list-none p-0' style={{ width: '200px' }}>
          <div
            className='flex w-full h-10 items-center justify-start list-none'
            style={{
              borderWidth: '0px 0px 1px',
              borderColor: 'rgb(218, 218, 218)',
              borderStyle: 'dotted',
            }}
          >
            <span className='text-base font-semibold'>CATEGORY</span>
          </div>
          <div className='relative py-3 text-base'>
            {parentCategories &&
              parentCategories?.map((parent) => (
                <div className='relative' key={parent.id}>
                  <div className='flex w-full items-center list-none'>
                    <div className='relative mr-3 space-y-5'>
                      <Link
                        to={{
                          pathname: `/category/${parent.name.toString().toLowerCase()}`,
                          state: {
                            parentId: parent.id,
                          },
                        }}
                      >
                        {parent.name}
                      </Link>
                      <div className='inline-flex relative pl-3'>
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
                    className={`relative flex flex-col space-y-5 my-5 ml-6 ${
                      selectedParent?.id === parent.id ? '' : 'hidden'
                    }`}
                  >
                    {parent.subCategories &&
                      parent?.subCategories?.map((sub) => (
                        <Link
                          to={{
                            pathname: `/category/${lowerCaseString(parent.name)}/${sub.name.toString().toLowerCase()}`,
                            state: {
                              id: sub.id,
                              parentId: parent.id,
                            },
                          }}
                          key={sub.id}
                        >
                          {sub.name}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </section>
        <section className='relative ml-6' style={{ width: '858px' }}>
          <div className='flex w-full justify-end list-none my-3'>
            <select
              className='form-select text-gray-600 font-medium w-1/4 bg-white focus:outline-none focus:shadow-outline flex'
              onChange={(e) => {
                setPageNum(1);
                setSortBy(e.target.value);
              }}
            >
              {sortsForUser &&
                sortsForUser.map((item, index) => (
                  <option value={item.value} key={item.label}>
                    {item.label}
                  </option>
                ))}
            </select>
          </div>
          <div className='flex w-full list-none'>
            <div className='w-full'>
              <div className='list-none p-0 m-0 grid grid-cols-4'>
                {products && products?.map((product) => <ItemBox item={product} key={product.id} />)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserCategory;
