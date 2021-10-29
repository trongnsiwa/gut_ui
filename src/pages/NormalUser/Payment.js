import { UserIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router';
import { getUserCart } from '../../services/cart.service';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getListProvinces, getListDistrictsByProvCode, getListWardsByDistCode } from '../../services/province.service';
import { Link } from 'react-router-dom';
import { formatCash } from '../../helpers/formatCash';

const Payment = (props) => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const location = useLocation();
  const history = useHistory();

  const [cart, setCart] = useState(null);

  const [totalPrice, setTotalPrice] = useState(null);
  const [shipping, setShipping] = useState(10000);
  const [promo, setPromo] = useState(null);

  const [provinces, setProvinces] = useState();
  const [selectedProv, setSelectedProv] = useState('');
  const [districts, setDistricts] = useState();
  const [selectedDist, setSelectedDist] = useState('');
  const [wards, setWards] = useState();
  const [selectedWard, setSelectedWard] = useState('');

  const [errorMessage, setErrorMessage] = useState({
    selected: null,
    message: null,
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập họ tên'),
    phone: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(
        /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/g,
        'Số điện thoại không hợp lệ'
      ),
    district: Yup.string().required('Vui lòng chọn quận/huyện'),
    ward: Yup.string().required('Vui lòng chọn phường/xã'),
    address: Yup.string().required('Vui lòng nhập điểm cụ thể'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    getListProvinces().then((res) => {
      setProvinces(res.data.results);
      console.log(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedProv) {
      getListDistrictsByProvCode(selectedProv).then((res) => {
        setDistricts(res.data.results);
        console.log(res.data);
      });
    }
    setSelectedDist('');
    setSelectedWard('');
    setWards(null);
  }, [selectedProv]);

  useEffect(() => {
    if (selectedDist) {
      getListWardsByDistCode(selectedDist).then((res) => {
        setWards(res.data.results);
        console.log(res.data);
      });
    }
  }, [selectedDist]);

  useEffect(() => {
    getUserCart(currentUser?.id)
      .then((res) => {
        setCart(res.data.data);
      })
      .catch((err) => {
        history.goBack();
      });
  }, []);

  useEffect(() => {
    if (cart && cart.cartItems) {
      setTotalPrice(cart?.cartItems.reduce((acc, item) => acc + (item.price * item.amount || 0), 0));
    }
  }, [cart]);

  if (!currentUser || currentUser?.role === 'ADMIN') {
    return <Redirect to='/' />;
  }

  return (
    <div className='container mt-10 p-0 bg-white rounded-sm'>
      <div className='flex flex-col lg:flex-row shadow-md'>
        <div className='w-full lg:w-2/3 px-5 lg:px-10 py-10'>
          <div className='flex justify-between border-b pb-8 mb-8'>
            <h1 className='font-semibold text-2xl flex'>
              <UserIcon className='h-8 w-8 mr-2' />
              Thông tin của bạn
            </h1>
          </div>
          <div>
            <div>
              <label htmlFor='name'>Tên</label>
              <input
                type='text'
                className={`border border-gray-400 resize-none w-full py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3 ${
                  errors.name ? 'error-input mb-0' : 'mb-6'
                }`}
                name='name'
                defaultValue={currentUser.fullname}
                placeholder='Tên người nhận'
                {...register('name')}
              />
              {errors.name && <p className='error-message mb-6'>{errors.name?.message}</p>}
            </div>
            <div>
              <label htmlFor='phone'>Điện thoại liên lạc</label>
              <input
                type='text'
                className={`border border-gray-400 resize-none w-full py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3 ${
                  errors.phone ? 'error-input' : ''
                }`}
                name='phone'
                defaultValue={currentUser.phone}
                placeholder='Số điện thoại'
                {...register('phone')}
              />
              {errors.phone && <p className='error-message mb-6'>{errors.phone?.message}</p>}
            </div>
            <div className='grid grid-cols-3 gap-6'>
              <div className='mt-5'>
                <label>Chọn tỉnh thành:</label>
                <select
                  className={`form-select block w-full mt-1 ${
                    errorMessage.selected != null && errorMessage.selected === 1 ? 'error-input' : ''
                  }`}
                  onChange={(e) => {
                    setSelectedProv(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (selectedProv == null || selectedProv === '') {
                      setErrorMessage({
                        selected: 1,
                        message: 'Vui lòng chọn tỉnh/thành phố',
                      });
                    } else {
                      setErrorMessage({
                        selected: null,
                        message: null,
                      });
                    }
                  }}
                  value={selectedProv}
                >
                  <option value='' disabled>
                    Tỉnh..
                  </option>
                  {provinces &&
                    provinces.map((province) => (
                      <option value={province['province_id']} key={province['province_id']}>
                        {province['province_name']}
                      </option>
                    ))}
                </select>
              </div>
              <div className='mt-5'>
                <label>Chọn quận huyện:</label>
                <select
                  className={`form-select block w-full mt-1 ${
                    errorMessage.selected != null && errorMessage.selected === 2 ? 'error-input' : ''
                  }`}
                  onChange={(e) => setSelectedDist(e.target.value)}
                  value={selectedDist}
                  onBlur={(e) => {
                    if (selectedDist == null || selectedDist === '') {
                      setErrorMessage({
                        selected: 2,
                        message: 'Vui lòng chọn quận/huyện',
                      });
                    } else {
                      setErrorMessage({
                        selected: null,
                        message: null,
                      });
                    }
                  }}
                >
                  <option value='' disabled>
                    Huyện..
                  </option>
                  {districts &&
                    districts.map((district) => (
                      <option value={district['district_id']} key={district['district_id']}>
                        {district['district_name']}
                      </option>
                    ))}
                </select>
              </div>

              <div className='mt-5'>
                <label>Chọn phường xã:</label>
                <select
                  className={`form-select block w-full mt-1 ${
                    errorMessage.selected != null && errorMessage.selected === 3 ? 'error-input' : ''
                  }`}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  value={selectedWard}
                  onBlur={(e) => {
                    if (selectedWard == null || selectedWard === '') {
                      setErrorMessage({
                        selected: 3,
                        message: 'Vui lòng chọn phường/xã',
                      });
                    } else {
                      setErrorMessage({
                        selected: null,
                        message: null,
                      });
                    }
                  }}
                >
                  <option value='' disabled>
                    Xã..
                  </option>
                  {wards &&
                    wards.map((ward) => (
                      <option value={ward['ward_id']} key={ward['ward_id']}>
                        {ward['ward_name']}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {errorMessage.selected != null && <p className='error-message mb-6'>{errorMessage.message}</p>}
            <div className='mt-5'>
              <label htmlFor='name'>Địa chỉ cụ thể</label>
              <span className='text-sm'> (Số nhà, tên đường, tên khu vực)</span>
              <input
                type='text'
                className={`border border-gray-400 resize-none w-full py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3 ${
                  errors.address ? 'error-input mb-0' : 'mb-6'
                }`}
                name='address'
                placeholder='Địa chỉ nhận hàng'
                {...register('address')}
              />
              {errors.address && <p className='error-message mb-6'>{errors.address?.message}</p>}
            </div>
            <div>
              <div>
                <label className='inline-flex items-center'>
                  <input type='radio' className='form-radio' name='method' value='' defaultChecked={true} />
                  <span className='ml-2'>Nhận hàng tại nhà/công ty/bưu điện</span>
                </label>
              </div>
              <div className='mt-3'>
                <label className='inline-flex items-center'>
                  <input type='radio' className='form-radio' name='method' value='' />
                  <span className='ml-2'>Nhận hàng tại cửa hàng gần nhất</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              <label className='block text-left'>
                <span>Ghi chú</span>
                <textarea
                  className='form-textarea mt-1 block w-full'
                  rows='3'
                  placeholder='Ghi chú về đơn hàng'
                  {...register('note')}
                ></textarea>
              </label>
            </div>
            <button
              type='submit'
              className={`w-full block  text-white rounded-lg px-4 py-3 mt-6 ${
                watch('name') === '' ||
                watch('phone') === '' ||
                errorMessage.selected != null ||
                watch('address') === ''
                  ? 'bg-gray-500 cursor-default'
                  : 'bg-brand hover:bg-brand-light focus:bg-brand-light'
              }`}
              disabled={
                watch('name') === '' ||
                watch('phone') === '' ||
                errorMessage.selected != null ||
                watch('address') === ''
              }
            >
              ĐẶT HÀNG
            </button>
          </div>
          <div className='mt-7'>
            <Link to='/'>
              <button type='button' className='bg-gray-300 hover:bg-gray-400 py-3 text-gray-800 w-full rounded-lg '>
                CẦN SẢN PHẨM KHÁC? TIẾP TỤC MUA HÀNG
              </button>
            </Link>
          </div>
        </div>

        <div id='summary' className='w-full lg:w-1/3 px-5 lg:px-10 py-10'>
          <h1 className='font-semibold text-2xl border-b pb-8 flex'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8 mr-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20'
              />
            </svg>
            Đơn hàng của bạn
          </h1>
          <div className='flex justify-between items-center mt-10 mb-7'>
            <span className='font-semibold flex items-center'>
              Sản phẩm:{' '}
              <span className='rounded-full bg-brand text-white px-2 py-1 text-xs font-bold items-center ml-2'>
                {' '}
                {cart ? cart?.cartItems?.reduce((acc, item) => acc + item.amount, 0) : 0}
              </span>
            </span>
          </div>
          <div>
            {cart &&
              cart?.cartItems.map((item) => (
                <div className='grid grid-cols-12 mb-5' key={item.id}>
                  <div className='flex items-center col-span-7'>
                    <img className='w-10' src={item.image?.imageUrl} alt={item.image ? item?.image.title : ''} />
                    <div className='flex flex-col justify-between ml-4 flex-grow'>
                      <div className='w-2/3 overflow-ellipsis whitespace-nowrap overflow-hidden'>
                        <span className='font-bold text-xs'>{item.productName}</span>
                      </div>

                      <p className='text-xs flex items-center'>{item.color.name}</p>
                      <p className='text-xs flex items-center'>{item.size.name}</p>
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <span>{item.amount}</span>
                  </div>
                  <div className='col-span-3 text-right'>
                    <span>{formatCash(item.price * item.amount)}</span>
                  </div>
                </div>
              ))}
          </div>
          <div className='flex justify-between items-center mt-10 pt-10 mb-5 border-t'>
            <span className='font-semibold flex items-center'>Tổng tiền: </span>
            <span>{formatCash(totalPrice ? totalPrice : 0)}</span>
          </div>
          <div className='flex justify-between items-center mb-5'>
            <span className='font-semibold flex items-center'>Phí vận chuyển: </span>
            <span>{'10.000đ'}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-semibold flex items-center'>Áp dụng Coupon: </span>
            <span className='text-red-500 font-semibold'>SALE101 [-10.000đ]</span>
          </div>
          <div className='flex justify-between items-center mt-10 pt-10 mb-5 border-t'>
            <span className='font-semibold flex items-center'>Tổng thanh toán: </span>
            <span className='text-brand text-2xl font-bold'>{formatCash(totalPrice ? totalPrice : 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
