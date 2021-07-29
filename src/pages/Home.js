import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { hideLoader, showLoader } from '../actions/LoaderAction';
import { getNewProducts, getSaleProducts } from '../services/home.service';

import { Role } from '../constants/Role';

import ItemBox from '../components/ItemBox';

import { formatCash } from '../helpers/formatCash';

const Home = () => {
  const [saleProducts, setSaleProducts] = useState(null);
  const [newProducts, setNewProducts] = useState(null);

  const { user: currentUser } = useSelector((state) => state.authReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  dispatch(hideLoader);

  if (currentUser && currentUser.roles?.includes(Role.ADMIN)) {
    history.push('/admin');
    window.location.reload();
  }

  useEffect(() => {
    if (!saleProducts) {
      dispatch(showLoader);

      getSaleProducts(6)
        .then((res) => {
          setSaleProducts(res.data.data);

          dispatch(hideLoader);
        })
        .catch((err) => {
          console.log(err.response);

          dispatch(hideLoader);
        });
    }
  }, [dispatch, saleProducts]);

  useEffect(() => {
    if (!newProducts) {
      dispatch(showLoader);

      getNewProducts(6)
        .then((res) => {
          setNewProducts(res.data.data);

          dispatch(hideLoader);
        })
        .catch((err) => {
          console.log(err.response);
          dispatch(hideLoader);
        });
    }
  }, [dispatch, newProducts]);

  return (
    <>
      <div className='w-full'>
        <div
          className='flex flex-col md:flex-row items-center object-cover h-screen bg-cover bg-center 2xl:px-40'
          style={{
            backgroundImage: `url('https://ik.imagekit.io/tnyyngwxvx9/ant-rozetsky-PH8dIIP0ljY-unsplash_MApZWo1fs.jpg?updatedAt=1627316554139')`,
          }}
        >
          <div className='flex flex-col w-full justify-center items-start p-4 md:p-8'>
            <h1 className='text-4xl md:text-7xl py-2 text-white font-bold'>WELCOME TO GUT</h1>
            <h2 className='text-3xl md:text-5xl leading-relaxed md:leading-snug mb-2 text-white p-2 bg-gradient-to-r from-brand-light to-brand'>
              GOOD CHOICE GOOD FASHION
            </h2>
            <p className='text-lg md:text-xl my-4 text-white font-medium'>Explore your favourite fashion for men.</p>
            <a
              href='#sale_section'
              className='text-white rounded shadow hover:shadow-lg py-4 px-10 mt-10 border border-white hover:border-transparent bg-gradient-to-r from-transparent  hover:from-brand-dark hover:to-brand'
            >
              Explore Now
            </a>
          </div>
        </div>
      </div>
      <section className='mx-auto w-full max-w-md text-center my-20 relative'>
        <input
          type='text'
          name='keywords'
          placeholder='Search products'
          className='h-15 m-0 pb-4 text-base border-0'
          style={{ borderBottom: '1px solid #5a5a5a', borderRadius: '0%' }}
        />
        <button type='submit' className='absolute top-0 mt-3 right-0 mr-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </button>
      </section>

      <hr className='my-10' />

      <div className='md:container mx-auto w-full text-black' style={{ maxWidth: '1160px' }}>
        {saleProducts && saleProducts.length > 0 && (
          <>
            <section
              id='sale_section'
              className='w-full'
              style={{ paddingBottom: '50px', borderBottom: '1px solid #E3E3E3' }}
            >
              <div className='my-20'>
                <h2 className='text-center text-xl md:text-3xl tracking-wide font-bold text-brand-darker'>SALE NOW</h2>
              </div>
              <div className='pb-10 px-10 table w-full'>
                <div className='w-full align-middle table md:w-auto md:pr-5 md:table-cell'>
                  {saleProducts[0] && (
                    <Link
                      to={{
                        pathname: `/product/${saleProducts[0].id}`,
                        state: {
                          parentId: null,
                          parentName: null,
                          categoryId: null,
                          categoryName: null,
                        },
                      }}
                    >
                      <div className='md:mb-5 hover:opacity-80'>
                        <div className='mb-2'>
                          <img
                            className='w-96'
                            alt={saleProducts[0].images.filter((item) => item.colorCode >= 0)[0]?.title}
                            src={saleProducts[0].images.filter((item) => item.colorCode >= 0)[0]?.imageUrl}
                          />
                        </div>
                        <div className='text-gray-700 block align-middle px-4 pb-4 md:text-center'>
                          <span className='inline-block border-red-600 border text-sm font-normal align-middle p-2 my-5 text-brand-sale'>{`Until ${dayjs(
                            saleProducts[0].saleToDate
                          ).format('M/DD (ddd)')}`}</span>
                          <h3 className='text-xl mb-5 font-bold'>{saleProducts[0].name}</h3>
                          <p className='mb-5 text-base'>{saleProducts[0].shortDesc}</p>
                          <div>
                            <p className='mb-1 text-sm leading-3'>
                              <span className='text-xs pr-2'>Regular price</span>
                              <span className='text-base'>{formatCash(saleProducts[0].price)}</span>
                            </p>
                            <p className='text-sm leading-3'>
                              <span className='border border-solid border-brand-sale text-brand-sale inline-block mr-2 px-2 py-1 text-xs align-middle -mt-1'>
                                Sale price
                              </span>
                              <span className='text-brand-sale font-bold text-lg'>
                                {formatCash(saleProducts[0].salePrice)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                <div className='mt-5 md:mt-0 md:table-cell md:w-2/3'>
                  <div className='relative'>
                    <ul style={{ width: '680px!important' }} className='grid grid-cols-3'>
                      {saleProducts && saleProducts.map((item) => <ItemBox item={item} key={item.id} />)}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <div className='md:container mt-10 m-auto w-full text-black' style={{ maxWidth: '1160px' }}>
        {newProducts && newProducts.length > 0 && (
          <>
            <section
              id='sale_section'
              className='w-full'
              style={{ paddingBottom: '50px', borderBottom: '1px solid #E3E3E3' }}
            >
              <div className='my-20'>
                <h2 className='text-center text-xl md:text-3xl tracking-wide font-bold text-brand-darker'>
                  NEW PRODUCTS
                </h2>
              </div>
              <div className='pb-10 px-10 table w-full'>
                <div className='mt-5 md:mt-0 md:table-cell md:w-2/3 align-top'>
                  <div style={{ minHeight: '478px' }} className='relative'>
                    <ul style={{ width: '680px!important' }} className='grid grid-cols-3'>
                      {newProducts && newProducts.map((item) => <ItemBox item={item} key={item.id} />)}
                    </ul>
                  </div>
                </div>
                <div className='w-full align-middle table md:w-auto md:pr-5 md:table-cell'>
                  {newProducts[0] && (
                    <Link
                      to={{
                        pathname: `/product/${newProducts[0].id}`,
                        state: {
                          parentId: null,
                          parentName: null,
                          categoryId: null,
                          categoryName: null,
                        },
                      }}
                    >
                      <div className='md:p-0  md:mb-5 hover:opacity-80'>
                        <div className='mb-2'>
                          <img
                            className='md:align-top border-none w-96'
                            alt={newProducts[0].images.filter((item) => item.colorCode >= 0)[0]?.title}
                            src={newProducts[0].images.filter((item) => item.colorCode >= 0)[0]?.imageUrl}
                          />
                        </div>
                        <div className='text-gray-700 block align-middle px-4 pb-4 pt-10 md:text-center'>
                          <h3 className='text-xl mb-2 font-bold'>
                            {newProducts[0].name} <span className='text-xl'>{formatCash(newProducts[0].price)}</span>
                          </h3>
                          <p className='mb-5 text-base'>{newProducts[0].shortDesc}</p>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
