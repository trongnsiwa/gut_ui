/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, Redirect, useHistory } from 'react-router-dom';
import { formatCash } from '../../helpers/formatCash';
import { getUserCart, updateItem } from '../../services/cart.service';

const Cart = (props) => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const location = useLocation();
  const history = useHistory();
  const { from } = location.state;

  const [cart, setCart] = useState(null);

  const [totalPrice, setTotalPrice] = useState(null);
  const [shipping, setShipping] = useState(10000);
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    getUserCart(currentUser?.id).then((res) => {
      setCart(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (cart && cart.cartItems) {
      setTotalPrice(cart?.cartItems.reduce((acc, item) => acc + (item.price * item.amount || 0), 0));
    }
  }, [cart]);

  const handleUpdateQuantity = (item, isIncrease) => {
    updateItem(currentUser?.id, item.productId, isIncrease ? item.amount + 1 : item.amount - 1)
      .then((res) => {
        if (isIncrease) {
          setCart({
            ...cart,
            cartItems: cart.cartItems.map((it) => {
              if (it.id === item.id) {
                return { ...it, amount: it.amount + 1 };
              }
              return { ...it };
            }),
          });
        } else {
          setCart({
            ...cart,
            cartItems: cart.cartItems.map((it) => {
              if (it.id === item.id) {
                return { ...it, amount: it.amount - 1 };
              }
              return { ...it };
            }),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!currentUser || currentUser?.role === 'ADMIN') {
    return <Redirect to='/' />;
  }

  return (
    <div className='container mt-10 p-0 bg-white rounded-sm'>
      <div className='flex flex-col lg:flex-row shadow-md'>
        <div className='w-full lg:w-2/3 px-5 lg:px-10 py-10'>
          <div className='flex justify-between border-b pb-8'>
            <h1 className='font-semibold text-2xl flex'>
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
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              Giỏ hàng của bạn
            </h1>
            <span className='rounded-full bg-brand text-white px-2 py-1 text-xs font-bold flex items-center'>
              {cart ? cart?.cartItems?.reduce((acc, item) => acc + item.amount, 0) : 0} sản phẩm
            </span>
          </div>
          <div className='flex my-5'>
            <h3 className='font-semibold text-gray-600 text-xs uppercase w-2/5'>Chi tiết sản phẩm</h3>
            <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>Só lượng</h3>
            <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>Giá</h3>
            <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>Tổng</h3>
          </div>
          {cart && cart.cartItems?.length > 0 ? (
            cart.cartItems.map((item) => (
              <div className='flex items-center hover:bg-gray-100 -mx-8 px-6 py-5' key={item.id}>
                <div className='flex w-2/5'>
                  <div className='w-20'>
                    <img src={item.image?.imageUrl} alt={item.image ? item?.image.title : ''} />
                  </div>
                  <div className='flex flex-col justify-between ml-4 flex-grow'>
                    <span className='font-bold text-sm md:text-base'>{item.productName}</span>
                    <p className='text-xs flex items-center'>
                      Màu sắc: <span className='ml-2'>{item.color.name}</span>
                    </p>
                    <p className='text-xs flex items-center'>
                      Kích cỡ: <span className='ml-2'>{item.size.name}</span>
                    </p>
                    <button className='font-semibold hover:text-red-500 text-gray-500 text-xs'>Xóa</button>
                  </div>
                </div>
                <div className='flex justify-center w-1/5'>
                  <button onClick={() => handleUpdateQuantity(item, false)} disabled={item.amount === 1}>
                    <svg className='fill-current text-gray-600 hover:text-brand w-3' viewBox='0 0 448 512'>
                      <path d='M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z' />
                    </svg>
                  </button>

                  <input className='mx-4 border text-center' type='text' value={item.amount} readOnly={true} />
                  <button onClick={() => handleUpdateQuantity(item, true)}>
                    <svg className='fill-current text-gray-600 hover:text-brand w-3' viewBox='0 0 448 512'>
                      <path d='M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z' />
                    </svg>
                  </button>
                </div>
                <span className='text-center w-1/5 text-lg'>{formatCash(item.price)}</span>
                <span className='text-center w-1/5 text-lg'>{formatCash(item.price * item.amount)}</span>
              </div>
            ))
          ) : (
            <p className='text-center my-10'>Chưa có sản phẩm trong giỏ hàng</p>
          )}

          <span
            className='flex font-semibold text-brand text-sm mt-10 hover:underline'
            onClick={() => {
              history.goBack();
            }}
          >
            <svg className='fill-current mr-2 text-brand w-4' viewBox='0 0 448 512'>
              <path d='M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z' />
            </svg>
            Tiếp tục mua sắm
          </span>
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
            Tóm tắt đơn hàng
          </h1>
          <div className='flex justify-between items-center my-10'>
            <span className='font-semibold flex items-center'>
              Sản phẩm:{' '}
              <span className='rounded-full bg-brand text-white px-2 py-1 text-xs font-bold items-center ml-2'>
                {' '}
                {cart ? cart?.cartItems?.reduce((acc, item) => acc + item.amount, 0) : 0}
              </span>
            </span>
            <span className='font-semibold text-xl'>{formatCash(totalPrice ? totalPrice : 0)}</span>
          </div>
          <div>
            <label className='font-semibold inline-block mb-3 text-sm'>Shipping</label>
            <select className='block p-2 text-gray-600 w-full' onChange={(e) => setPromo(e.target.value)}>
              <option value='10000'>Phí ship thông thường - 10K</option>
            </select>
          </div>
          <div className='py-10'>
            <label htmlFor='promo' className='font-semibold inline-block mb-3 text-sm'>
              Mã khuyến mãi (Nếu có)
            </label>
            <div className='flex items-center'>
              <input
                type='text'
                id='promo'
                placeholder='Nhập mã của bạn'
                className='p-2 w-2/3 mr-2'
                onChange={(e) => setPromo(e.target.value)}
              />
              <button className='bg-gray-500 hover:bg-gray-600 p-3 text-sm text-white w-1/3'>Áp dụng</button>
            </div>
          </div>

          <div className='border-t mt-8'>
            <div className='flex font-semibold justify-between py-6 items-center'>
              <span>Tổng đơn hàng:</span>
              <span className='text-xl'>
                {formatCash(shipping ? (totalPrice ? totalPrice : 0) + shipping : totalPrice ? totalPrice : 0)}
              </span>
            </div>

            <Link to='/payment'>
              <button type='button' className='bg-brand-dark hover:bg-brand-darker py-3 text-white w-full'>
                THANH TOÁN
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
