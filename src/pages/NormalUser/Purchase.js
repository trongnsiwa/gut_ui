import React from 'react';
import { Link } from 'react-router-dom';
import { formatCash } from '../../helpers/formatCash';

const Purchase = () => {
  const tempPurchase = [
    {
      id: 'SDSDSDS13JEASDA',
      name: 'Nguyen Trong',
      phone: '0977158941',
      address: 'Ấp 5, Xã An Phước, Huyện Long Thành, Tỉnh Đồng Nai',
      method: 'Nhận hàng tại nhà/công ty/bưu điện',
      note: '',
      shipping: 10000,
      coupon: {
        name: 'SALE101',
        sale: 10000,
      },
      orderDate: '30/10/2021',
      products: [
        {
          image: 'http://res.cloudinary.com/trongnsiwa/image/upload/v1627353780/w6hilzj0csmisyqbnsd5.webp',
          name: 'Áo mơ smi Oxford',
          color: 'Trắng Anti-flash',
          size: 'XL',
          amount: 2,
          price: 59000,
        },
        {
          image: 'http://res.cloudinary.com/trongnsiwa/image/upload/v1627182371/hjl4rgc02gt4zctkil3w.webp',
          name: 'Quần nửa co giãn chủ động GA',
          color: 'Xanh đen',
          size: 'XL',
          amount: 1,
          price: 59000,
        },
      ],
    },
    {
      id: 'SDASDAS121219D',
      name: 'Nguyen Trong',
      phone: '0977158941',
      address: 'Ấp 5, Xã An Phước, Huyện Long Thành, Tỉnh Đồng Nai',
      method: 'Nhận hàng tại nhà/công ty/bưu điện',
      note: '',
      shipping: 10000,
      coupon: {
        name: 'SALE101',
        sale: 10000,
      },
      orderDate: '28/10/2021',
      products: [
        {
          image: 'http://res.cloudinary.com/trongnsiwa/image/upload/v1627290620/mo6yq9ehrjsomkjwnbli.webp',
          name: 'Wide fit T Keina Suda 3',
          color: 'Đen',
          size: 'XXL',
          amount: 1,
          price: 99000,
        },
      ],
    },
  ];

  return (
    <div className='container mt-10 p-0'>
      <div className='px-5 lg:px-10 py-10'>
        <div className='border-b-2 border-white pb-3'>
          <p className='text-2xl text-white font-bold'>Đơn mua</p>
        </div>
        <div className='mt-7'>
          {tempPurchase &&
            tempPurchase.map((item) => (
              <Link to={{ pathname: `/user/purchase/${item.id}`, state: item }}>
                <div className='bg-white rounded-sm shadow-md p-5 mb-5'>
                  <div className='flex justify-between mb-5'>
                    <p className='text-xs'>Mã đơn hàng: {item.id}</p>
                    <p className='text-xs'>Ngày đặt hàng: {item.orderDate}</p>
                  </div>
                  <div className='divide-y'>
                    {item.products.map((p) => (
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
                    ))}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Purchase;
