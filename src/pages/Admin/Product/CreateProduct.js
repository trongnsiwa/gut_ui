import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import ERRORS from '../../../constants/Errors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showLoader } from '../../../actions/LoaderAction';
import { showError, showErrorMessage, showSuccessMessage } from '../../../helpers/showToast';
import Calendar from 'react-calendar';
import Tippy from '@tippyjs/react';
import dayjs from 'dayjs';
import { addProduct } from '../../../services/product.service';
import { getALlColors } from '../../../services/color.service';
import { getALlSizes } from '../../../services/size.service';
import Select from 'react-select';
import { format } from '../../../helpers/String';

const CreateProduct = () => {
  const [colors, setColors] = useState(null);
  const [colorSource, setColorSource] = useState([]);
  const [sizes, setSizes] = useState(null);
  const [colorSize, setColorSize] = useState({
    colorId: -1,
    colorName: '',
    sizes: [],
  });
  const [colorSizes, setColorSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [allowChangeColor, setAllowChangeColor] = useState(true);
  const [quantity, setQuantity] = useState(0);

  const [sales, setSales] = useState({
    sale: false,
    saleFromDate: new Date(),
    saleToDate: new Date(),
  });

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(ERRORS.ERR_PRODUCT_NAME_NOT_BLANK)
      .test('len', ERRORS.ERR_PRODUCT_NAME_SIZE, (val) => {
        if (val) return val.toString().length >= 1 && val.toString().length <= 100;
      }),
    price: Yup.number()
      .typeError(ERRORS.ERR_PRODUCT_PRICE_NUMBER)
      .required(ERRORS.ERR_PRODUCT_PRICE_NOT_NULL)
      .min(1000, ERRORS.ERR_PRODUCT_PRICE_MIN),
    shortDesc: Yup.string().max(1000, ERRORS.ERR_PRODUCT_SHORT_DESC_SIZE),
    material: Yup.string().max(255, ERRORS.ERR_PRODUCT_MATERIAL_SIZE),
    handling: Yup.string().max(255, ERRORS.ERR_PRODUCT_HANDLING_SIZE),
    sale: Yup.boolean(),
    categoryId: Yup.number()
      .typeError(ERRORS.ERR_PRODUCT_CATEGORY_NUMBER)
      .required(ERRORS.ERR_PRODUCT_CATEGORY_NOT_NULL)
      .min(1, ERRORS.ERR_PRODUCT_CATEGORY_MIN),
    brandId: Yup.number()
      .typeError(ERRORS.ERR_BRAND_ID_NOT_NUMBER)
      .required(ERRORS.ERR_BRAND_ID_NOT_NULL)
      .min(1, ERRORS.ERR_BRAND_ID_MIN),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitHandler = ({
    name,
    price,
    shortDesc,
    longDesc,
    material,
    handling,
    sale,
    priceSale,
    saleFromDate,
    saleToDate,
    deleted,
    categoryId,
    brandId,
  }) => {
    var fromDate = null;
    var toDate = null;
    if (sale) {
      fromDate = new Date(new Date(saleFromDate).setHours(0, 0, 0, 0));
      toDate = new Date(new Date(saleToDate).setHours(0, 0, 0, 0));

      fromDate = new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toJSON();
      toDate = new Date(toDate.getTime() - toDate.getTimezoneOffset() * 60000).toJSON();

      if (!priceSale || priceSale === '') {
        showError(ERRORS.ERR_PRODUCT_PRICE_SALE_NOT_NULL);
        return;
      }
      if (isNaN(parseFloat(priceSale))) {
        showError(ERRORS.ERR_PRODUCT_PRICE_SALE_NUMBER);
        return;
      }
      if (parseFloat(priceSale) < 1000) {
        showError(ERRORS.ERR_PRODUCT_PRICE_SALE_MIN);
        return;
      }
    } else {
      priceSale = null;
    }

    var productColorSizes = [];
    if (colorSizes.length > 0) {
      productColorSizes = colorSizes.map((item) => {
        return {
          colorId: item.colorId,
          sizes: [...item.sizes].map((size) => {
            return {
              sizeId: size.sizeId,
              quantity: size.quantity,
            };
          }),
        };
      });
    }

    if (productColorSizes.length === 0) {
      showError(ERRORS.ERR_PRODUCT_COLORS_NOT_EMPTY);
      return;
    }

    dispatch(showLoader());

    addProduct(
      name,
      price,
      shortDesc,
      longDesc,
      material,
      handling,
      sale,
      priceSale,
      fromDate,
      toDate,
      productColorSizes,
      categoryId,
      brandId
    )
      .then((res) => {
        console.log(res.data.data);
        showSuccessMessage(res, name, dispatch);
        reset();
        setSales({
          sale: false,
          saleFromDate: new Date(),
          saleToDate: new Date(),
        });
      })
      .catch((error) => {
        var code =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        var showId = null;

        if (code.includes('CATEGORY')) {
          showId = categoryId;
        } else {
          showId = name;
        }
        showErrorMessage(error, showId, dispatch);
      });
  };

  useEffect(() => {
    getALlColors().then((res) => {
      var listColorOptions = [];
      res.data.data.forEach((color) => {
        const option = {
          value: color.id,
          label: color.name,
        };
        listColorOptions.push(option);
      });
      setColors(listColorOptions);
      setColorSource(res.data.data);
    });
  }, []);

  useEffect(() => {
    getALlSizes().then((res) => {
      var listSizeOptions = [];
      res.data.data.forEach((size) => {
        const option = {
          value: size.id,
          label: size.name,
        };
        listSizeOptions.push(option);
      });
      // console.log(listSizeOptions);
      setSizes(listSizeOptions);
    });
  }, []);

  const handleAddToColor = () => {
    if (colorSize.colorId < 0) {
      showError(ERRORS.ERR_COLOR_NOT_CHOOSE);
      return;
    }

    if (selectedSize === null) {
      showError(ERRORS.ERR_SIZE_NOT_CHOOSE);
      return;
    }

    if (colorSize.sizes.find((size) => size.sizeId === selectedSize.sizeId)) {
      showError(format(ERRORS.ERR_SIZE_ALREADY_EXIST, selectedSize.sizeName, colorSize.colorName));
      return;
    }

    if (allowChangeColor) {
      setAllowChangeColor(false);
    }

    setColorSize({
      ...colorSize,
      sizes: [
        ...colorSize.sizes,
        {
          sizeId: selectedSize.sizeId,
          sizeName: selectedSize.sizeName,
          quantity,
        },
      ],
    });
  };

  const handleAddColorSizeToList = () => {
    if (colorSizes && colorSizes.find((color) => color.colorId === colorSize.colorId)) {
      showError(format(ERRORS.ERR_COLOR_ALREADY_EXIST, colorSize.colorName));
    } else {
      setColorSizes([...colorSizes, colorSize]);
    }

    setAllowChangeColor(true);
    setColorSize({
      colorId: -1,
      colorName: '',
      sizes: [],
    });
  };

  const findSourceById = (id) => {
    return colorSource && ((colorSource.find((item) => item.id === id) || {}).source || []);
  };

  const handleDeleteColor = (id) => {
    setColorSizes([...colorSizes].filter((item) => item.colorId !== id));
  };

  return (
    <>
      <div className='min-h-screen w-full px-4 pt-4'>
        <div className='section-title w-full p-4'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
              <div className='text-xs uppercase font-light text-gray-500'>TAB</div>
              <div className='text-2xl font-bold text-brand-dark'>CREATE PRODUCT</div>
            </div>
          </div>
        </div>

        <hr className='mx-4 mb-4 border-dashed border-1 border-brand-light' />

        <div className='mb-12 xl:flex xl:flex-row'>
          <div className='my-6 mx-4 xl:container xl:w-1/2 bg-white p-6 shadow-lg border-brand rounded-lg'>
            <p className='text-base font-thin text-right text-gray-400'>
              Required fields <span className='text-brand-dark'>*</span>
            </p>
            <form
              className='mb-0 grid-cols-3 inline-grid gap-0 space-y-6 lg:mr-16'
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className='flex items-center'>
                <label htmlFor='name' className='block text-base font-medium text-gray-700'>
                  Product name <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='flex items-center col-span-2 w-full'>
                <div>
                  <input
                    className={errors.name && 'error-input'}
                    type='text'
                    name='name'
                    id='name'
                    {...register('name')}
                  />
                  <p className='error-message'>{errors.name?.message}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <label htmlFor='price' className='block text-base font-medium text-gray-700'>
                  Price <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='flex items-center col-span-2 w-1/3'>
                <div>
                  <input
                    className={errors.price && 'error-input'}
                    type='text'
                    name='price'
                    id='price'
                    {...register('price')}
                  />
                  <p className='error-message'>{errors.price?.message}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <label htmlFor='shortDesc' className='block text-base font-medium text-gray-700'>
                  Short description
                </label>
              </div>
              <div className='flex items-center col-span-2 w-full'>
                <div>
                  <textarea
                    className={errors.shortDesc && 'error-input'}
                    type='textarea'
                    rows={3}
                    cols={50}
                    name='shortDesc'
                    id='shortDesc'
                    {...register('shortDesc')}
                  />
                  <p className='error-message'>{errors.shortDesc?.message}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <label htmlFor='longDesc' className='block text-base font-medium text-gray-700'>
                  Long description
                </label>
              </div>
              <div className='flex items-center col-span-2'>
                <div>
                  <textarea
                    type='textarea'
                    rows={5}
                    cols={50}
                    name='longDesc'
                    id='longDesc'
                    {...register('longDesc')}
                  />
                </div>
              </div>
              <div className='flex items-center'>
                <label htmlFor='material' className='block text-base font-medium text-gray-700'>
                  Material
                </label>
              </div>
              <div className='flex items-center col-span-2 w-2/3'>
                <div>
                  <input
                    className={errors.material && 'error-input'}
                    type='text'
                    name='material'
                    id='material'
                    {...register('material')}
                  />
                  <p className='error-message'>{errors.material?.message}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <label htmlFor='handling' className='block text-base font-medium text-gray-700'>
                  Handling
                </label>
              </div>
              <div className='flex items-center col-span-2 w-2/3 '>
                <div>
                  <input
                    className={errors.handling && 'error-input'}
                    type='text'
                    name='handling'
                    id='handling'
                    {...register('handling')}
                  />
                  <p className='error-message'>{errors.handling?.message}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <label htmlFor='sale' className='block text-base font-medium text-gray-700 '>
                  Is sale?
                </label>
              </div>
              <div className='flex items-center col-span-2'>
                <input
                  type='checkbox'
                  id='sale'
                  name='sale'
                  className={`form-checkbox`}
                  {...register('sale')}
                  onClick={() => {
                    setSales({
                      ...sales,
                      sale: !sales.sale,
                    });
                  }}
                />
              </div>
              {sales.sale === true && (
                <>
                  <div className='flex items-center'>
                    <label htmlFor='priceSale' className='block text-base font-medium text-gray-700'>
                      Price sale
                    </label>
                  </div>
                  <div className='flex items-center col-span-2 w-2/3'>
                    <div>
                      <input type='text' name='priceSale' id='priceSale' {...register('priceSale')} />
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor='saleFromDate' className='block text-base font-medium text-gray-700'>
                      Sale From
                    </label>
                  </div>
                  <div className='flex items-center col-span-2'>
                    <div>
                      <Tippy
                        interactive={true}
                        placement={'bottom'}
                        theme={'light-border'}
                        content={
                          <Calendar
                            onChange={(value, event) => {
                              setSales({
                                ...sales,
                                saleFromDate: value,
                              });
                              if (sales.saleToDate && new Date(sales.saleToDate).getTime() < value.getTime()) {
                                setSales({
                                  ...sales,
                                  saleToDate: value,
                                });
                              }
                            }}
                            value={sales.saleFromDate}
                            minDate={new Date()}
                            className='ring-2 ring-brand-light shadow-lg rounded-base hover:text-brand-dark'
                          />
                        }
                      >
                        <div>
                          <input type='text' value={dayjs(sales.saleFromDate).format('DD/MM/YYYY')} readOnly={true} />
                          <input
                            type='hidden'
                            name='saleFromDate'
                            id='saleFromDate'
                            {...register('saleFromDate')}
                            value={sales.saleFromDate}
                          />
                        </div>
                      </Tippy>{' '}
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <label htmlFor='saleToDate' className='block text-base font-medium text-gray-700'>
                      Sale To
                    </label>
                  </div>
                  <div className='flex items-center col-span-2'>
                    <div>
                      <Tippy
                        interactive={true}
                        placement={'bottom'}
                        theme={'light-border'}
                        content={
                          <Calendar
                            id='saleToDate'
                            onChange={(value, event) =>
                              setSales({
                                ...sales,
                                saleToDate: value,
                              })
                            }
                            value={sales.saleToDate}
                            minDate={sales.saleFromDate}
                            className='ring-2 ring-brand-light shadow-lg rounded-base hover:text-brand-dark'
                          />
                        }
                      >
                        <div>
                          <input type='text' value={dayjs(sales.saleToDate).format('DD/MM/YYYY')} readOnly={true} />
                          <input
                            type='hidden'
                            name='saleToDate'
                            id='saleToDate'
                            {...register('saleToDate')}
                            value={sales.saleToDate}
                          />
                        </div>
                      </Tippy>{' '}
                    </div>
                  </div>
                </>
              )}
              <div className='flex items-center'>
                <label htmlFor='categoryId' className='block text-base font-medium text-gray-700'>
                  Category Id <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='flex items-center col-span-2 w-2/3'>
                <div>
                  <input
                    className={errors.categoryId && 'error-input'}
                    type='text'
                    name='categoryId'
                    id='categoryId'
                    {...register('categoryId')}
                  />
                  <p className='error-message'>{errors.categoryId?.message}</p>
                </div>
              </div>
              <div className='flex items-center'>
                <label htmlFor='brandId' className='block text-base font-medium text-gray-700'>
                  Brand Id <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='flex items-center col-span-2 w-2/3'>
                <div>
                  <input
                    className={errors.brandId && 'error-input'}
                    type='text'
                    name='brandId'
                    id='brandId'
                    {...register('brandId')}
                  />
                  <p className='error-message'>{errors.brandId?.message}</p>
                </div>
              </div>

              <div className='flex flex-row col-span-3'>
                <button
                  type='submit'
                  className='block bg-brand-dark hover:bg-brand-darker focus:bg-brand-darker text-white font-semibold rounded-lg px-4 py-3 mt-6'
                >
                  Create new
                </button>
                <button
                  type='button'
                  className='block bg-gray-400 hover:bg-gray-500 focus:bg-gray-500 font-semibold rounded-lg px-4 py-3 mt-6 ml-3'
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div className='h-screen lg:overflow-y-auto my-6 mx-4 xl:container xl:w-1/2 bg-white p-6 shadow-lg border-brand rounded-lg'>
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
              COLOR AND SIZE
            </p>
            <div className='space-y-6 mt-3'>
              <div className='flex items-center'>
                <p className='block text-base font-medium text-gray-700 mr-3'>Choose color:</p>
                <div className='w-2/3'>
                  <Select
                    options={colors}
                    onChange={({ label, value }) =>
                      setColorSize({
                        ...colorSize,
                        colorId: value,
                        colorName: label,
                      })
                    }
                    isSearchable={allowChangeColor}
                    openMenuOnClick={allowChangeColor}
                    menuIsOpen={!allowChangeColor ? false : undefined}
                  />
                </div>
              </div>
              <div className='flex items-center'>
                <p
                  className='block text-base font-medium text-gray-700 mr-3
                '
                >
                  Choose size:
                </p>
                <div className='w-1/3'>
                  <Select
                    options={sizes}
                    onChange={({ label, value }) =>
                      setSelectedSize({
                        sizeId: value,
                        sizeName: label,
                      })
                    }
                  />
                </div>
                <p
                  className="className='block text-base font-medium text-gray-700 mx-3
                "
                >
                  Quantity
                </p>
                <div className='1/3 mr-3'>
                  <input
                    type='number'
                    min={0}
                    defaultValue={0}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                </div>
                <button
                  className='block bg-brand-dark hover:bg-brand-darker focus:bg-brand-darker text-white font-semibold rounded-lg h-12 px-2'
                  onClick={handleAddToColor}
                >
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
                      d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </button>
              </div>

              {colorSize && colorSize.colorId > -1 && colorSize.sizes.length > 0 && (
                <div className='flex items-center'>
                  <p
                    className='block text-base font-medium text-gray-700 mr-3
                '
                  >
                    Added color:{' '}
                    <span
                      className='rounded-lg p-1 text-gray-400 cursor-pointer hover:text-gray-700'
                      style={{ backgroundColor: `${findSourceById(colorSize.colorId)}` }}
                      onClick={() => {
                        setColorSize({
                          colorId: -1,
                          colorName: '',
                          sizes: [],
                        });
                        setAllowChangeColor(true);
                      }}
                    >
                      {colorSize.colorName}
                    </span>
                  </p>
                  <div className='flex justify-center items-center'>
                    <div className='bg-white shadow-xl rounded-lg'>
                      <ul>
                        {colorSize.sizes.map((size) => (
                          <li
                            key={size.sizeId}
                            className='p-4 hover:bg-gray-50 cursor-pointer inline-grid mx-2'
                            onClick={() => {
                              if (colorSize.sizes.length > 1) {
                                setColorSize({
                                  ...colorSize,
                                  sizes: [...colorSize.sizes].filter((item) => item !== size),
                                });
                              } else {
                                setColorSize({
                                  colorId: -1,
                                  colorName: '',
                                  sizes: [],
                                });
                                setAllowChangeColor(true);
                              }
                            }}
                          >
                            {size.sizeName} - {size.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className='block bg-brand-dark hover:bg-brand-darker focus:bg-brand-darker text-white font-semibold rounded-lg h-12 px-2 ml-3'
                      onClick={handleAddColorSizeToList}
                    >
                      Add to list color
                    </button>
                  </div>
                </div>
              )}
              <p className='text-sm font-thin text-right text-gray-400'>
                * Add color and add sizes with quantity (ex: L - 9) to the color, then add to the list.
              </p>
              {colorSizes && colorSizes.length > 0 && (
                <div className='mx-auto'>
                  {colorSizes.map((color) => (
                    <div className='flex items-center' key={color.colorId + '_cs'}>
                      <p
                        className='block text-base font-medium text-gray-700 mr-3
                '
                      >
                        Color:{' '}
                        <span
                          className='rounded-lg p-1 text-gray-400 cursor-pointer hover:text-gray-700'
                          style={{ backgroundColor: `${findSourceById(color.colorId)}` }}
                          onClick={() => handleDeleteColor(color.colorId)}
                        >
                          {color.colorName}
                        </span>
                      </p>
                      <div className='flex justify-center items-center'>
                        <div className='bg-white shadow-xl rounded-lg mt-3'>
                          <ul>
                            {color.sizes.map((size) => (
                              <li key={size.sizeId + '_color'} className='p-4 hover:bg-gray-50  inline-grid mx-2'>
                                {size.sizeName} - {size.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
