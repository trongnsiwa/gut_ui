import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { hideLoader, showLoader } from '../actions/LoaderAction';
import ItemBox from '../components/ItemBox';
import { Role } from '../constants/Role';
import { formatCash } from '../helpers/formatCash';
import { getNewProducts, getSaleProducts } from '../services/home.service';

const Home = () => {
  const [saleProducts, setSaleProducts] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [size, setSize] = useState(6);

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

      getSaleProducts(size)
        .then((res) => {
          setSaleProducts(res.data.data);
          console.log(res.data.data);
          dispatch(hideLoader);
        })
        .catch((err) => {
          console.log(err.response);
          dispatch(hideLoader);
        });
    }
  }, [dispatch, saleProducts, size]);

  useEffect(() => {
    if (!newProducts) {
      dispatch(showLoader);

      getNewProducts(size)
        .then((res) => {
          setNewProducts(res.data.data);
          console.log(res.data.data);
          dispatch(hideLoader);
        })
        .catch((err) => {
          console.log(err.response);
          dispatch(hideLoader);
        });
    }
  }, [dispatch, newProducts, size]);

  return (
    <>
      <div className='w-full'>
        <div
          class='flex flex-col md:flex-row items-center object-cover h-screen bg-cover bg-center 2xl:px-40'
          style={{
            backgroundImage: `url('https://ik.imagekit.io/tnyyngwxvx9/ant-rozetsky-PH8dIIP0ljY-unsplash_MApZWo1fs.jpg?updatedAt=1627316554139')`,
          }}
        >
          <div class='flex flex-col w-full justify-center items-start p-4 md:p-8'>
            <h1 class='text-4xl md:text-7xl py-2 text-white tracking-loose font-bold'>WELCOME TO GUT</h1>
            <h2 class='text-3xl md:text-5xl leading-relaxed md:leading-snug mb-2 text-white p-2 bg-brand-light'>
              GOOD CHOICE GOOD FASHION
            </h2>
            <p class='text-lg md:text-xl my-4 text-white font-semibold'>Explore your favourite fashion for men.</p>
            <button class='text-white rounded shadow hover:shadow-lg py-4 px-10 border border-white bg-gradient-to-r from-transparent  hover:from-brand-dark hover:to-brand'>
              Explore Now
            </button>
          </div>
        </div>
      </div>
      <section className='m-auto w-full max-w-md text-center my-20 relative'>
        <input
          type='text'
          name='keywords'
          placeholder='Search products'
          className='h-15 m-0 pb-4 text-base leading-2 border-0'
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

      <div className='md:container m-auto w-full text-black' style={{ maxWidth: '1160px' }}>
        {saleProducts && saleProducts.length > 0 && (
          <>
            <section
              id='sale_section'
              className='w-full'
              style={{ paddingBottom: '50px', borderBottom: '1px solid #E3E3E3' }}
            >
              <div className='mt-22 mb-20'>
                <h2 className='text-center text-xl md:text-3xl tracking-wide font-bold text-brand-darker'>SALE NOW</h2>
              </div>
              <div className='pb-10 px-10 table w-full'>
                <div className='w-full align-middle table md:w-auto md:pr-5 md:table-cell'>
                  {saleProducts[0] && (
                    <Link to={`/product/${saleProducts[0].id}`}>
                      <div className='md:p-0  md:mb-5 hover:opacity-80'>
                        <div className='mb-2'>
                          <img
                            className='md:align-top border-none w-96'
                            alt={saleProducts[0].images.filter((item) => item.colorCode >= 0)[0]?.title}
                            src={saleProducts[0].images.filter((item) => item.colorCode >= 0)[0]?.imageUrl}
                          />
                        </div>
                        <div className='text-gray-700 block align-middle px-4 pb-4 md:text-center'>
                          <span
                            className='inline-block border-red-600 border text-sm font-normal align-middle p-2 my-5'
                            style={{ color: '#fe0000' }}
                          >{`Until ${dayjs(saleProducts[0].saleToDate).format('M/DD (ddd)')}`}</span>
                          <h3 className='text-xl mb-2 font-bold'>{saleProducts[0].name}</h3>
                          <p className='mb-5 text-base'>{saleProducts[0].shortDesc}</p>
                          <div>
                            <p className='mb-1 text-sm leading-3'>
                              <span className='text-xs pr-2'>Regular price</span>
                              <span className='text-base'>{formatCash(saleProducts[0].price)}</span>
                            </p>
                            <p className='text-sm leading-3'>
                              <span
                                style={{ border: '1px solid #fe0000', color: '#fe0000' }}
                                className='inline-block mr-2 px-2 pt-1 text-xs align-middle -mt-1'
                              >
                                Sale price
                              </span>
                              <span style={{ color: '#fe0000' }} className='font-bold text-lg'>
                                {formatCash(saleProducts[0].salePrice)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                <div className='mt-5 md:mt-0 md:table-cell md:w-2/3 align-top'>
                  <div style={{ minHeight: '478px' }} className='relative'>
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
              <div className='mt-22 mb-20'>
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
                    <Link to={`/product/${newProducts[0].id}`}>
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
