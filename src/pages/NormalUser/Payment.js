import { UserIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router';
import { getUserCart } from '../../services/cart.service';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getListProvinces } from '../../services/province.service';

const Payment = (props) => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const location = useLocation();
  const history = useHistory();

  const [cart, setCart] = useState(null);

  const [totalPrice, setTotalPrice] = useState(null);
  const [shipping, setShipping] = useState(10000);
  const [promo, setPromo] = useState(null);

  const [provinces, setProvinces] = useState();
  const [selectedProv, setSelectedProv] = useState();
  const [districts, setDistricts] = useState();
  const [selectedDist, setSelectedDist] = useState();
  const [wards, setWards] = useState();
  const [selectedWard, setSelectedWard] = useState();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập họ tên'),
    phone: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(
        /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/g,
        'Số điện thoại không hợp lệ'
      ),
    address: Yup.string().test('needChooseAddress', 'Vui lòng chọn địa chỉ của bạn', (ele) => ele !== '--'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
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
              <label htmlFor='name' className='font-bold'>
                Họ và tên:
              </label>
              <input
                type='text'
                className={`border border-gray-400 resize-none w-full py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3 ${
                  errors.name ? 'error-input mb-0' : 'mb-6'
                }`}
                name='name'
                placeholder='Nhập họ và tên tại đây'
                {...register('name')}
              />
              {errors.name && <p className='error-message mb-6'>{errors.name?.message}</p>}
            </div>
            <div>
              <label htmlFor='phone' className='font-bold'>
                Số điện thoại:
              </label>
              <input
                type='text'
                className={`border border-gray-400 resize-none w-full py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3 ${
                  errors.phone ? 'error-input' : ''
                }`}
                name='phone'
                placeholder='Nhập số điện thoại tại đây'
                {...register('phone')}
              />
              {errors.phone && <p className='error-message mb-6'>{errors.phone?.message}</p>}
            </div>
            <div className='mt-5'>
              <label className='font-bold'>Chọn tỉnh thành:</label>
              <select className='form-select block w-full mt-1'>
                <option value='' disabled selected>
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
          </div>
        </div>

        <div id='summary' className='w-full lg:w-1/3 px-5 lg:px-10 py-10'></div>
      </div>
    </div>
  );
};

export default Payment;
