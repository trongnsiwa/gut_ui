import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { formatCash } from '../../helpers/formatCash';
import { getUserCart } from '../../services/cart.service';

const FinishOrder = () => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const location = useLocation();
  const history = useHistory();

  const [cart, setCart] = useState(null);

  const [totalPrice, setTotalPrice] = useState(null);
  const [shipping, setShipping] = useState(10000);
  const [promo, setPromo] = useState({
    name: 'SALE101',
    sale: 10000,
  });

  const [order, setOrder] = useState({
    address: 'Âp 6, Xã An Phước, Huyện Long Thành, Tỉnh Đồng Nai',
    phone: '0977158941',
    method: 'Nhận hàng tại nhà/công ty/bưu điện',
    note: '',
  });

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
    <div className='mt-10 mx-auto bg-white rounded-sm shadow-md max-w-2xl p-7'>
      <div className='flex justify-center items-center flex-col'>
        <img src='https://cdn-icons-png.flaticon.com/512/782/782746.png' alt='' className='w-24' />
        <p className='mt-5 font-bold text-brand text-2xl'>ĐẶT HÀNG THÀNH CÔNG</p>
      </div>
      <div className='mt-10 px-16'>
        <p className='font-semibold border-b pb-2'>THÔNG TIN ĐƠN HÀNG</p>
        <div className='mt-5 text-sm text-right'>
          <span>Mã đơn hàng:</span>
          <span className='font-bold ml-3'>#100002</span>
        </div>
        <div>
          <span>Người nhận hàng:</span>
          <div className='text-sm font-semibold mt-2 text-right'>
            <p>{currentUser.fullname}</p>
            <p>{order.phone}</p>
            <p>{order.address}</p>
            <p>{order.note}</p>
          </div>
        </div>
        <div className='mt-5 border-b-2 pb-2'>
          <span>Chi tiết đơn hàng:</span>
          <div className='mt-3'>
            {cart &&
              cart?.cartItems.map((item) => (
                <div className='flex items-center' key={item.id}>
                  <img className='w-10' src={item.image?.imageUrl} alt={item.image ? item?.image.title : ''} />
                  <span className='ml-4'>{item.amount + ' x '}</span>
                  <div className='flex flex-col justify-between ml-4 flex-grow'>
                    <span className='font-bold text-xs'>{item.productName}</span>

                    <p className='text-xs flex items-center'>{item.color.name}</p>
                    <p className='text-xs flex items-center'>{item.size.name}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className='border-b-2 pb-7'>
          <div className='flex justify-between items-center mt-7 mb-3'>
            <span className='font-semibold flex items-center'>Tổng tiền: </span>
            <span>{formatCash(totalPrice ? totalPrice : 0)}</span>
          </div>
          <div className='flex justify-between items-center mb-3'>
            <span className='font-semibold flex items-center'>Phí vận chuyển: </span>
            <span>{formatCash(shipping)}</span>
          </div>
          <div className='flex justify-between items-center mb-3'>
            <span className='font-semibold flex items-center'>Áp dụng Coupon: </span>
            <span>
              {promo.name} [-{formatCash(promo.sale)}]
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-semibold flex items-center'>Tổng thanh toán: </span>
            <span className='text-brand font-bold'>{formatCash(totalPrice ? totalPrice : 0)}</span>
          </div>
        </div>
        <div className='mt-5'>
          <p className='text-sm text-center'>
            Cảm ơn bạn đã mua hàng tại{' '}
            <Link to='/' className='text-brand hover:text-brand-dark font-bold'>
              GUT
            </Link>{' '}
            . Nhân viên của chúng tôi sẽ điện thoại cho bạn trong thời gian sớm nhất để xác nhận đơn hàng.
          </p>
        </div>
        <Link to='/'>
          <button
            type='button'
            className='w-full block text-white rounded-sm px-4 py-2 mt-10 focus:bg-brand-light bg-brand-light hover:bg-brand'
          >
            TRỞ VỀ TRANG CHỦ
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FinishOrder;
