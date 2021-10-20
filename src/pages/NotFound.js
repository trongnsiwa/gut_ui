import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <div className='bg-gradient-to-r from-blue-300 to-blue-200'>
        <div className='w-9/12 m-auto py-16 flex items-center justify-center' style={{ height: 'calc(100vh - 80px)' }}>
          <div className='bg-white shadow overflow-hidden rounded-lg pb-8'>
            <div className='text-center pt-8'>
              <h1 className='text-5xl sm:text-9xl font-bold text-brand'>404</h1>
              <h1 className='text-3xl sm:text-5xl font-medium font-mono pb-8 pt-3'>Oops! Không tìm thây trang</h1>
              <p className='text-lg sm:text-2xl pb-8 px-12 font-mono'>
                Trang bạn đang tìm kiếm không tồn tại. Nó có thể đã bị di chuyển hoặc bị xóa.
              </p>
              <Link
                to='/'
                className='bg-gradient-to-r from-brand-light to-brand hover:from-brand-dark hover:to-brand text-white font-semibold px-6 py-3 rounded-md'
              >
                Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
