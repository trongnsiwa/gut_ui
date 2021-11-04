import { ChevronLeftIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { formatCash } from '../../helpers/formatCash';

const PurchaseDetail = () => {
  const { user: currentUser } = useSelector((state) => state.authReducer);
  const location = useLocation();
  const history = useHistory();

  const item = location.state;

  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    if (item && item.products) {
      setTotalPrice(item.products.reduce((acc, item) => acc + (item.price * item.amount || 0), 0));
    }
  }, [item]);

  if (!currentUser || currentUser?.role === 'ADMIN') {
    return <Redirect to='/' />;
  }

  return (
    <div className='container mt-10 p-0 bg-white rounded-sm shadow-md'>
      <div className='flex items-center justify-between pb-5 border-b border-gray-100 p-5'>
        <p
          className='flex items-center text-sm cursor-pointer'
          onClick={() => {
            history.goBack();
          }}
        >
          <ChevronLeftIcon className='w-5 h-5 mr-2' /> TRỞ LẠI
        </p>
        <div className='flex gap-6 divide-x'>
          <p className='text-sm'>Mã đơn hàng: {item.id}</p>
          <p className='text-sm pl-5'>Ngày đặt hàng: {item.orderDate}</p>
        </div>
      </div>
      <div className='p-5 border-b border-gray-100'>
        <span className='font-semibold'>Địa chỉ nhận hàng:</span>
        <div className='text-sm mt-2'>
          <p>{item.name}</p>
          <p>{item.phone}</p>
          <p>{item.address}</p>
          <p>{item.note}</p>
        </div>
      </div>
      <div className='border-b border-gray-100 pb-2 bg-gray-50'>
        <div className='px-5 divide-y'>
          {item.products.map((p) => (
            <Link
              to={{
                pathname: `/product/${p.id}`,
                state: {
                  parentId: '',
                  parentName: '',
                  categoryId: '',
                  categoryName: '',
                },
              }}
            >
              <div className='flex justify-between items-center mb-5 pt-5' key={p.id}>
                <div className='flex items-center'>
                  <img className='w-20' src={p.image} alt='' />
                  <div className='flex flex-col justify-between h-full ml-5'>
                    <div className='flex flex-col'>
                      <span className='font-bold text-sm'>{p.name}</span>

                      <p className='text-xs flex items-center'>{p.color}</p>
                      <p className='text-xs flex items-center'>{p.size}</p>
                    </div>
                    <span className='text-xs'>x {p.amount}</span>
                  </div>
                </div>
                <div className='text-right'>
                  <span className='text-sm'>{formatCash(p.price * p.amount)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <table className='table-fixed border border-gray-100 border-collapse w-full'>
        <tbody className='divide-y divide-gray-100'>
          <tr className='divide-x divide-gray-100'>
            <td className='text-sm w-2/3 text-right p-3'>Tổng tiền: </td>
            <td className='text-sm'>{formatCash(totalPrice ? totalPrice : 0)}</td>
          </tr>
          <tr className='divide-x divide-gray-100'>
            <td className='text-sm text-right p-3'>Phí vận chuyển: </td>
            <td className='text-sm'>{formatCash(item.shipping)}</td>
          </tr>
          <tr className='divide-x divide-gray-100'>
            <td className='text-sm text-right p-3'>Áp dụng Voucher: </td>
            <td className='text-sm'>
              {item.voucher.name} (-{item.voucher.sale}%)
            </td>
          </tr>
          <tr className='divide-x divide-gray-100'>
            <td className='text-sm text-right p-3'>Tổng thanh toán: </td>
            <td className='text-brand font-bold text-xl'>
              {formatCash(totalPrice ? totalPrice - (totalPrice * item.voucher.sale) / 100 - item.shipping : 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseDetail;
