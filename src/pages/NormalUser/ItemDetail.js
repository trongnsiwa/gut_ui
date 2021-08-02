import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { ChevronDownIcon, StarIcon } from '@heroicons/react/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Thumbs } from 'swiper';

import { hideLoader, showLoader } from '../../actions/LoaderAction';

import ERRORS from '../../constants/Errors';
import { Role } from '../../constants/Role';

import { showError, showErrorMessage, showSuccessMessage } from '../../helpers/showToast';
import { format } from '../../helpers/formatString';
import { formatCash } from '../../helpers/formatCash';

import { addUserReviewToProduct, getProductDetail } from '../../services/product.service';

import RatingStar from '../../components/ReviewForm/RatingStar';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import { clearMessage, setMessage } from '../../actions/MessageAction';
import { showStoreErrorMessage } from '../../helpers/setErrorMessage';
import { addToCart } from '../../services/cart.service';

SwiperCore.use([Navigation, Pagination, Thumbs]);

const ItemDetail = (props) => {
  const { id } = props.match.params;
  const { parentId, parentName } = props.location.state;

  const [details, setDetails] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [productImages, setProductImages] = useState(null);
  const [colorSizes, setColorSizes] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [seeMore, setSeeMore] = useState(2);

  const { user: currentUser } = useSelector((state) => state.authReducer);
  const history = useHistory();
  const { message } = useSelector((state) => state.messageReducer);
  const dispatch = useDispatch();

  if (currentUser && currentUser.roles?.includes(Role.ADMIN)) {
    history.push('/admin');
    window.location.reload();
  }
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(ERRORS.ERR_REVIEW_TITLE_NOT_BLANK),
    comment: Yup.string().required(ERRORS.ERR_REVIEW_COMMENT_NOT_BLANK),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  if (details?.deleted) {
    props.history.push('/not-found');
  }

  useEffect(() => {
    dispatch(showLoader());

    getProductDetail(id)
      .then((res) => {
        setDetails(res.data.data);
        console.log(res.data.data);

        dispatch(hideLoader());
      })
      .catch((err) => {
        showError(format(ERRORS.ERR_PRODUCT_LOADED_FAIL, id));

        dispatch(hideLoader());
        props.history.push('/');
      });
  }, [dispatch, id, props.history]);

  useEffect(() => {
    if (details) {
      setReviews(details.reviews);
    }
  }, [details]);

  useEffect(() => {
    const productImages = [];

    if (activeColor && details) {
      productImages.push(details.productImages?.find((img) => img.colorCode === activeColor.colorId));

      details.productImages?.forEach((img) => {
        if (img.colorCode < 0) {
          productImages.push(img);
        }
      });
    }

    setProductImages(productImages);
  }, [activeColor, details]);

  useEffect(() => {
    if (details && details.colorSizes.length > 0) {
      const colors = [...new Set(details.colorSizes.map((item) => item.color.id))];

      const productColorSizes = colors.map((color) => {
        return {
          colorId: color,
          colorName: null,
          colorSource: null,
          sizes: [],
        };
      });

      const productColors = productColorSizes.map((color) => {
        var sizes = [];
        var first = true;
        var colorName = null;
        var colorSource = null;

        details.colorSizes.forEach((item) => {
          if (item.color.id === color.colorId) {
            sizes = [
              ...sizes,
              {
                sizeId: item.size.id,
                sizeName: item.size.name,
                quantity: item.quantity,
              },
            ];

            if (first) {
              colorName = item.color.name;
              colorSource = item.color.source;
            }
          }
        });

        return {
          ...color,
          colorName,
          colorSource,
          sizes,
        };
      });

      setColorSizes(productColors);
    }
  }, [details]);

  useEffect(() => {
    if (colorSizes && !activeColor) {
      setActiveColor(colorSizes[0]);
    }
  }, [activeColor, colorSizes]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      if (reviews.length > 1) {
        const countRating = reviews.reduce((acc, cur) => acc + cur.rating, 0);
        setAverageRating(_.round(countRating / reviews.length, 2));
      } else {
        setAverageRating(reviews[0].rating);
      }
    }
  }, [reviews]);

  const renderQuantity = () => {
    var listQuantity = [];

    if (activeSize?.quantity > 10) {
      for (var i = 1; i <= activeSize?.quantity; i++) {
        listQuantity.push(i);
      }
    } else {
      for (var i2 = 1; i2 <= 10; i2++) {
        listQuantity.push(i2);
      }
    }

    return listQuantity;
  };

  const handlePostComment = ({ title, comment }) => {
    if (!currentUser) {
      dispatch(setMessage(ERRORS.ERR_LOGIN_REQUIRED));
      return;
    }

    if (!rating) {
      dispatch(setMessage(ERRORS.ERR_REVIEW_RATING_NOT_NULL));
      return;
    }

    dispatch(showLoader());

    addUserReviewToProduct(parseInt(id), currentUser?.id, title, comment, parseInt(rating))
      .then((res) => {
        setReviews(res.data.data.reviews);
        setRating(null);
        reset();
        dispatch(clearMessage());
        dispatch(hideLoader());
      })
      .catch((error) => {
        var code =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        var showId = null;

        if (code.includes('USER')) {
          showId = currentUser?.fullname;
        } else {
          showId = id;
        }

        showStoreErrorMessage(error, showId, dispatch);
        dispatch(clearMessage());
      });
  };

  const handleAddToCart = () => {
    var isValid = true;

    if (!currentUser) {
      showError(ERRORS.ERR_LOGIN_REQUIRED);
      return;
    }

    if (!activeColor) {
      showError(ERRORS.ERR_CART_COLOR_ID_NOT_NULL);
      isValid = false;
    } else if (activeColor && activeColor.colorId < 0) {
      showError(ERRORS.ERR_CART_COLOR_ID_MIN);
      isValid = false;
    }

    if (!activeSize) {
      showError(ERRORS.ERR_CART_SIZE_ID_NOT_NULL);
      isValid = false;
    } else if (activeSize && activeSize.sizeId < 0) {
      showError(ERRORS.ERR_CART_SIZE_ID_MIN);
      isValid = false;
    }

    if (!selectedQuantity || (selectedQuantity && selectedQuantity < 1)) {
      showError(ERRORS.ERR_CART_AMOUNT_MIN);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    dispatch(showLoader());

    addToCart(currentUser?.id, id, activeColor.colorId, activeSize.sizeId, selectedQuantity)
      .then((res) => {
        showSuccessMessage(res, id, dispatch);
        localStorage.setItem('cart', JSON.stringify(res.data.data));
      })
      .catch((err) => {
        showErrorMessage(err, id, dispatch);
      });
  };

  return (
    <div className='lg:container'>
      <nav className='text-gray-600 mt-8 text-sm px-6' aria-label='Breadcrumb'>
        <ol className='list-none p-0 inline-flex'>
          <li className='flex items-center'>
            <Link to='/'>Home</Link>
            <svg className='fill-current w-3 h-3 mx-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
              <path d='M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z' />
            </svg>
          </li>
          {parentId && (
            <li className='flex items-center'>
              <Link
                to={{
                  pathname: `/category/${parentName}`,
                  state: {
                    parentId,
                  },
                }}
              >
                {parentName}
              </Link>
              <svg className='fill-current w-3 h-3 mx-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
                <path d='M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z' />
              </svg>
            </li>
          )}
          <li>
            <span className='text-gray-700'>{details?.name}</span>
          </li>
        </ol>
      </nav>

      <div>
        <div className='pt-5 md:pt-0 md:flex w-full mx-auto px-2 md:px-6'>
          <div className='flex flex-col m-0 p-0 w-full' style={{ width: '500px' }}>
            <section className='mr-6'>
              <Swiper
                id='gallery'
                thumbs={{ swiper: thumbsSwiper }}
                wrapperTag='ul'
                tag='section'
                navigation
                pagination
                spaceBetween={0}
                slidesPerView={1}
                centeredSlides={true}
              >
                {productImages &&
                  productImages.map((image, index) => (
                    <SwiperSlide tag='li' key={'img_' + index} style={{ listStyle: 'none' }}>
                      <img src={image && image.imageUrl} alt={image && image.title} />
                    </SwiperSlide>
                  ))}
              </Swiper>
              <Swiper
                id='thumbs'
                spaceBetween={10}
                slidesPerView={7}
                watchSlidesProgress
                watchSlidesVisibility
                onSwiper={setThumbsSwiper}
                style={{ width: 'auto', height: 'auto' }}
              >
                {productImages &&
                  productImages.map((image, index) => (
                    <SwiperSlide
                      tag='li'
                      key={'image_' + index + '_thumb'}
                      style={{ listStyle: 'none', position: 'relative', cursor: 'pointer' }}
                    >
                      {({ isActive }) => (
                        <div
                          className='w-full h-full'
                          style={{
                            borderWidth: '1px',
                            borderColor: `${isActive ? 'rgb(27, 27, 27)' : 'transparent'}`,
                            borderStyle: 'solid',
                          }}
                          key={`inside_img_thum_${index}`}
                        >
                          <img
                            src={image && image.imageUrl}
                            alt={image && image.title}
                            className={`${isActive ? 'p-2' : ''}`}
                          />
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
              </Swiper>
            </section>
          </div>
          <div className='mt-6' style={{ width: '578px' }}>
            <div className='flex flex-col m-0 p-0'>
              <div className='mb-6'>
                <span className='text-2xl font-semibold'>{details?.name}</span>
              </div>
              <div className='mb-3'>
                <div className='flex w-full items-start flex-wrap gap-3 list-none'>
                  {details?.brandNew && (
                    <div className='flex items-center p-2 border border-green-500 border-solid'>
                      <span className='text-green-500 tracking-normal text-xs'>New</span>
                    </div>
                  )}
                  {details?.sale && (
                    <div className='flex items-center p-2 border border-brand-sale border-solid'>
                      <span className='text-brand-sale tracking-normal text-xs'>Sale</span>
                    </div>
                  )}
                </div>
              </div>
              <div className='relative mb-2'>
                <span
                  className={`text-3xl font-semibold ${
                    details?.sale ? 'text-brand-sale' : ''
                  } whitespace-nowrap align-baseline`}
                >
                  {details && details?.sale
                    ? formatCash(details.priceSale ? details?.priceSale : '')
                    : formatCash(details ? details?.price : '')}
                </span>
                <span
                  className={`text-xl text-gray-500 ${
                    details?.sale ? 'block' : 'hidden'
                  } whitespace-nowrap align-baseline line-through`}
                >
                  {details && formatCash(details ? details?.price : '')}
                </span>
              </div>
              <div className='relative my-3'>
                <div className='flex items-center'>
                  <div className='mr-2'>
                    <RatingStar rating={averageRating} />
                  </div>
                  <span> | {reviews?.length}</span>
                </div>
              </div>
              <section className='relative my-6'>
                <div className='relative mb-3'>
                  <div className='flex w-full items-end list-none'>
                    <div className='relative mr-2'>
                      <span className='text-sm font-bold'>colors:</span>
                    </div>
                    <span className='font-sm'>{activeColor?.colorName}</span>
                  </div>
                </div>
                <div className='grid gap-2' style={{ gridTemplateColumns: 'repeat(auto-fill, 36px)' }}>
                  {colorSizes &&
                    colorSizes?.map((color) => (
                      <span
                        className={`cursor-pointer text-sm box-border inline-flex justify-center items-center align-middle relative w-8 h-8 rounded-full ${
                          activeColor?.colorId === color?.colorId && 'border-2 border-white shadow-lg p-2'
                        }`}
                        style={{
                          backgroundColor: `${color?.colorSource}`,
                        }}
                        onClick={() => setActiveColor(color)}
                        key={`color_${color.colorId}`}
                      ></span>
                    ))}
                </div>
              </section>
              <section className='my-6'>
                <div className='mb-3'>
                  <div className='flex w-full list-none'>
                    <div className='relative'>
                      <span className='text-sm font-bold mr-2'>sizes:</span>
                      <span className='font-sm'>{activeSize?.sizeName}</span>
                    </div>
                  </div>
                  <div className='relative flex flex-wrap -mr-1 -mb-1 mt-3'>
                    {activeColor &&
                      activeColor?.sizes?.map((size) => (
                        <span
                          className={`mr-3 mb-2 cursor-pointer relative text-base box-border inline-flex justify-center items-center align-middle border border-solid border-gray-600 w-16 h-10 ${
                            activeSize?.sizeId === size.sizeId ? 'bg-brand-dark text-white' : ''
                          } ${size.quantity === 0 ? 'line-through pointer-events-none' : ''}
                          `}
                          onClick={() => setActiveSize(size)}
                          key={`size_${size.sizeId}`}
                        >
                          {size.sizeName}
                        </span>
                      ))}
                  </div>
                </div>
              </section>
              <div className='flex items-center w-full mb-6'>
                <span className='text-sm font-bold mr-2'>quantity:</span>
                <div>
                  <select
                    className='form-select text-gray-600 font-medium bg-white focus:outline-none focus:shadow-outline flex'
                    onChange={(e) => {
                      setSelectedQuantity(e.target.value);
                    }}
                  >
                    {renderQuantity()?.map((quantity, index) => (
                      <option value={quantity} key={`qty_${quantity}`}>
                        {quantity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='w-full mt-6'>
                <button
                  type='submit'
                  className='bg-brand text-lg text-white
               font-semibold w-full max-w-md p-5 rounded-2xl shadow-xl hover:bg-brand-dark'
                  onClick={() => {
                    handleAddToCart();
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-10 mx-6 w-2/3 h-full'>
          <section>
            <div className='mb-5 mt-10'>
              <span className='text-xl font-bold'>Product description</span>
            </div>
            <div className='mb-5'>
              <span className='text-base'>{details?.longDesc}</span>
            </div>
            <div className='pb-2 mt-10 mb-6 border-b-2 border-solid border-gray-500'>
              <span className='font-bold text-xl'>Materials and handling</span>
            </div>
            <div className='flex w-full justify-between'>
              <span className='font-bold'>Material</span>
              <div className='w-2/3 flex flex-col mb-6'>
                <span>{details?.material}</span>
              </div>
            </div>
            <div className='flex w-full justify-between'>
              <span className='font-bold'>Handling</span>
              <div className='w-2/3 flex flex-col mb-6'>
                <span>{details?.handling}</span>
              </div>
            </div>
          </section>
          <section>
            <div className='mb-3 mt-10'>
              <span className='text-xl font-bold'>User reviews</span>
            </div>
            <div className='mb-5'>
              <div className='w-full flex items-center'>
                <span className='mr-3'>Average rating</span>
                <div className='mr-2'>
                  <RatingStar rating={averageRating} />
                </div>
                <span> | {reviews?.length}</span>
              </div>

              <div className='mt-10 max-w-lg'>
                {reviews &&
                  reviews?.map(
                    (review, index) => index < seeMore && <ReviewForm review={review} key={`review_${index}`} />
                  )}
                {reviews && reviews.length > seeMore && (
                  <button
                    type='button'
                    className='flex items-center w-100 justify-center h-10 border-t border-solid border-gray-100'
                    onClick={() => setSeeMore(seeMore + 2)}
                    key='see_more'
                  >
                    <div className='flex w-full items-center justify-center'>
                      <span className='font-bold text-center'>See more</span>
                      <ChevronDownIcon className='h-6 w-6' />
                    </div>
                  </button>
                )}
                {!reviews || (reviews?.length === 0 && <span key='no_review'>No reviews for this product yet</span>)}
              </div>
            </div>
            <div className='flex items-center justify-center mb-4 max-w-lg h-full'>
              <form className='w-full max-w-xl bg-white rounded-lg pt-2' onSubmit={handleSubmit(handlePostComment)}>
                <div className='flex flex-wrap -mx-3 mb-6'>
                  <div className='flex justify-between items-center'>
                    <h2 className='px-4 pt-3 pb-2 text-gray-800 text-lg'>Add a new review</h2>

                    <div className='flex items-center'>
                      {[...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;

                        return (
                          <label key={`star_${ratingValue}`}>
                            <input
                              className='hidden'
                              type='radio'
                              name='rating'
                              value={ratingValue}
                              onClick={() => setRating(ratingValue)}
                            />
                            <StarIcon
                              className={`star h-6 w-6 cursor-pointer transition-colors delay-75 hover:text-yellow-500 ${
                                ratingValue <= (hover || rating) ? 'text-yellow-500' : 'text-gray-500'
                              }`}
                              onMouseEnter={() => setHover(ratingValue)}
                              onMouseLeave={() => setHover(null)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  {message && <p className='error-message col-span-2 px-3 mb-2'>{message}</p>}
                  <div className='w-full px-3 mb-2 mt-2'>
                    <input
                      type='text'
                      className={`border border-gray-400 resize-none w-full py-2 px-3 font-medium focus:outline-none focus:bg-white ${
                        errors.title ? 'error-input mb-0' : 'mb-6'
                      }`}
                      placeholder='Add title'
                      {...register('title')}
                    />
                    <p className={`error-message ${errors.title ? 'mb-6' : ''}`}>{errors.title?.message}</p>
                    <textarea
                      className={`rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium focus:outline-none focus:bg-white ${
                        errors.comment?.message ? 'error-input' : ''
                      }`}
                      name='comment'
                      placeholder='Type Your Comment'
                      {...register('comment')}
                    ></textarea>
                    <p className='error-message  mb-6'>{errors.comment?.message}</p>
                  </div>
                  <div className='w-full md:w-full flex items-start px-3'>
                    <div className='-mr-1'>
                      <input
                        type='submit'
                        className='bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100'
                        value='Post Comment'
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
