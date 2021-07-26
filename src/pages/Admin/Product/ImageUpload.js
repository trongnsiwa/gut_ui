import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../../actions/LoaderAction';
import { getProductDetail, replaceImages } from '../../../services/product.service';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Thumbs } from 'swiper';
import Tippy from '@tippyjs/react';
import { showError, showErrorMessage, showSuccess, showSuccessMessage } from '../../../helpers/showToast';
import axios from 'axios';
import Select from 'react-select';

SwiperCore.use([Navigation, Pagination, Thumbs]);

const supportedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

const ImageUpload = (props) => {
  const { id } = props.match.params;
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState(null);
  const [colors, setColors] = useState(null);
  const [title, setTitle] = useState(null);
  const [colorCode, setColorCode] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [preview, setPreview] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoader());

    getProductDetail(id).then((res) => {
      console.log(res.data.data);
      setProduct(res.data.data);
      dispatch(hideLoader());
    });
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setProductImages(product.productImages);
    }
  }, [product]);

  useEffect(() => {
    if (product && product.colorSizes.length > 0) {
      var listColorOptions = [];
      listColorOptions.push({ label: 'Select color', value: -1 });

      var colors = [...new Set(product.colorSizes.map((item) => item.color.id))];

      colors = colors.map((color) => {
        return {
          id: color,
          name: product.colorSizes.find((item) => item.color.id === color).color.name,
        };
      });

      colors.forEach((color) => {
        const option = {
          value: color.id,
          label: color.name,
        };
        listColorOptions.push(option);
      });
      setColors(listColorOptions);
    }
  }, [product]);

  useEffect(() => {
    if (fileUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(fileUpload);
    } else {
      setPreview(null);
    }
  }, [fileUpload]);

  const handleFileUpload = (e) => {
    const path = e.target.value.split('.');
    const extension = `${path[path.length - 1]}`;

    if (supportedExtensions.includes(extension)) {
      const file = e.target.files[0];

      if (file && file.type.substr(0, 5) === 'image') {
        var img = new Image();

        img.src = window.URL.createObjectURL(file);

        img.onload = function () {
          var width = img.naturalWidth,
            height = img.naturalHeight;

          window.URL.revokeObjectURL(img.src);

          if (width >= 1024 && height >= 1024) {
            showError('File format is incorrect.');
            return;
          }
        };

        setFileUpload(file);
      } else {
        showError('Size too large.');
        setFileUpload(null);
      }
    } else {
      showError('Please choose image to upload.');
    }
  };

  const handleCreate = () => {
    if (!fileUpload) {
      showError('Please choose image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileUpload);
    formData.append('upload_preset', 'zeiy0z45');

    dispatch(showLoader());

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    axios
      .post(`https://api.cloudinary.com/v1_1/trongnsiwa/image/upload`, formData, config)
      .then((res) => {
        setProductImages([
          ...productImages,
          {
            imageUrl: res.data.url,
            title,
            colorCode: colorCode ? colorCode.value : -1,
          },
        ]);
        setFileUpload(null);
        setPreview(null);
        setColorCode(null);
        showSuccess('Upload image successful!');
        dispatch(hideLoader());
      })
      .catch((error) => {
        showError('Cannot upload image file now. Please try again later!');
        dispatch(hideLoader());
      });
  };

  const handleUploadImageList = () => {
    dispatch(showLoader());

    replaceImages(id, productImages)
      .then((res) => {
        console.log(res.data.data);
        showSuccessMessage(res, id, dispatch);
      })
      .catch((error) => {
        showErrorMessage(error, id, dispatch);
      });
  };

  return (
    <>
      <div className='min-h-screen w-full px-4 pt-4'>
        <div className='section-title w-full p-4'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
              <div className='text-xs uppercase font-light text-gray-500'>TAB</div>
              <div className='text-2xl font-bold text-brand-dark'>PRODUCT: {product ? product.name : id}</div>
            </div>
          </div>
        </div>

        <hr className='mx-4 mb-4 border-dashed border-1 border-brand-light' />

        <div className='mb-12 xl:flex xl:flex-row'>
          <div className='my-6 mx-4 xl:container xl:w-1/2 bg-white p-6 shadow-lg border-brand rounded-lg'>
            <div className='w-full'>
              {productImages && productImages.length > 0 && (
                <>
                  <Swiper
                    id='gallery'
                    thumbs={{ swiper: thumbsSwiper }}
                    wrapperTag='ul'
                    tag='section'
                    navigation
                    pagination
                    spaceBetween={30}
                    slidesPerView={1}
                    centeredSlides={true}
                  >
                    {productImages &&
                      productImages.map((image, index) => (
                        <SwiperSlide tag='li' key={'image_' + index} style={{ listStyle: 'none' }}>
                          <img src={image.imageUrl} alt={image.title} />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                  <Swiper
                    id='thumbs'
                    spaceBetween={5}
                    slidesPerView={3}
                    onSwiper={setThumbsSwiper}
                    style={{ width: '500px', marginTop: '20px' }}
                  >
                    {productImages.map((image, index) => (
                      <SwiperSlide
                        tag='li'
                        key={'image_' + index + '_thumb'}
                        style={{ listStyle: 'none', position: 'relative' }}
                      >
                        <img src={image.imageUrl} alt={image.title} />
                        <Tippy
                          interactive={true}
                          placement={'bottom'}
                          theme={'light-border'}
                          content={'Click to remove'}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6 text-gray-500 hover:text-red-600 absolute cursor-pointer left-full'
                            style={{ right: '2px', top: '2px', marginLeft: '-30px', marginTop: '5px' }}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            onClick={() => {
                              setProductImages([...productImages].filter((img) => img.imageUrl !== image.imageUrl));
                            }}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                        </Tippy>{' '}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              )}
              <button
                className='block mx-auto bg-brand-dark hover:bg-brand-darker focus:bg-brand-darker text-white font-semibold rounded-lg px-4 py-3 mt-10'
                onClick={handleUploadImageList}
              >
                Update image list
              </button>
            </div>
          </div>

          <div className='overflow-y-auto my-6 mx-4 xl:container xl:w-1/2 bg-white p-6 shadow-lg border-brand rounded-lg'>
            <p className='text-xl font-bold mb-3 text-brand-dark flex flex-row items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 mr-3'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z'
                />
              </svg>{' '}
              UPLOAD IMAGE
            </p>
            <div>
              <div className='max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-lg'>
                <div className='p-3'>
                  <div className='mb-3'>
                    {' '}
                    <span className='text-base font-semibold'>
                      Title <span className='text-red-500'>*</span>
                    </span>{' '}
                    <input
                      type='text'
                      className='h-12 px-3 w-full border-gray-200 border rounded focus:outline-none focus:border-gray-300'
                      onChange={(e) => setTitle(e.target.value)}
                    />{' '}
                  </div>
                  <div className='mb-3'>
                    {' '}
                    <span className='text-base font-semibold'>
                      Color <span className='text-red-500'>*</span>
                    </span>{' '}
                    <Select
                      options={colors}
                      onChange={({ label, value }) =>
                        setColorCode({
                          value,
                          label,
                        })
                      }
                      value={colorCode || { label: 'Select color', value: -1 }}
                      defaultValue={{ label: 'Select color', value: -1 }}
                    />
                  </div>
                  <div className='mb-2'>
                    {' '}
                    <span className='text-base font-semibold'>Attachments</span>
                    <div
                      className={`relative ${
                        preview ? 'h-full' : 'h-40'
                      } rounded-lg border-dashed border-2 border-gray-200 bg-white flex justify-center items-center hover:cursor-pointer`}
                    >
                      {preview ? (
                        <>
                          <img src={preview} alt='' className='object-cover max-w-full max-h-full' />
                          <Tippy
                            interactive={true}
                            placement={'bottom'}
                            theme={'light-border'}
                            content={'Click to remove'}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-6 w-6 text-gray-500 hover:text-red-600 absolute cursor-pointer left-full'
                              style={{ right: '2px', top: '2px', marginLeft: '-30px', marginTop: '5px' }}
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                              onClick={() => {
                                setFileUpload(null);
                                setPreview(null);
                              }}
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                            </svg>
                          </Tippy>{' '}
                        </>
                      ) : (
                        <>
                          <div className='absolute'>
                            <div className='flex flex-col items-center '>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-16 w-16 text-gray-200'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                                />
                              </svg>
                              <span className='block text-gray-400 font-normal'>Attach you files here</span>{' '}
                              <span className='block text-gray-400 font-normal'>or</span>{' '}
                              <span className='block text-blue-400 font-normal'>Browse files</span>{' '}
                            </div>
                          </div>{' '}
                          <input
                            type='file'
                            className='h-full w-full opacity-0'
                            name='fileUpload'
                            id='fileUpload'
                            accept='image/*'
                            onChange={handleFileUpload}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className='mt-3 text-center pb-3'>
                    {' '}
                    <button
                      className='block w-full bg-brand-dark hover:bg-brand-darker focus:bg-brand-darker text-white font-semibold rounded-lg px-4 py-3 mt-6'
                      onClick={handleCreate}
                    >
                      Create
                    </button>{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
