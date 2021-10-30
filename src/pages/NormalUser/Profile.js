import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.authReducer);

  return (
    <div className='container mt-10 p-0 bg-white rounded-sm shadow-md'>
      <div className='px-5 lg:px-10 py-10'>
        <div className='border-b pb-5'>
          <p className='text-xl'>Hồ Sơ của Tôi</p>
        </div>
        <div className='flex flex-col lg:flex-row'>
          <div className='w-full lg:w-2/3 pr-5'>
            <div className='mt-5 table w-full'>
              <div className='table-row'>
                <label className='table-cell text-right pr-3'>Tên</label>
                <input
                  type='text'
                  className={`border border-gray-400 resize-none py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3`}
                  name='name'
                  defaultValue={currentUser.fullname}
                />
              </div>
              <div className='table-row'>
                <label className='table-cell text-right pr-3'>Email</label>
                <input
                  type='text'
                  className={`border border-gray-400 resize-none py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3`}
                  name='email'
                  defaultValue={currentUser.email}
                />
              </div>
              <div className='table-row'>
                <label className='table-cell text-right pr-3'>Số điện thoại</label>
                <input
                  type='text'
                  className={`border border-gray-400 resize-none py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3`}
                  name='email'
                  defaultValue={currentUser.phone}
                />
              </div>
              <div className='table-row'>
                <label className='table-cell text-right pr-3'>Địa chỉ</label>
                <input
                  type='text'
                  className={`border border-gray-400 resize-none py-2 px-3 font-medium focus:outline-none focus:bg-white mt-3`}
                  name='email'
                  defaultValue={currentUser.address}
                />
              </div>
              <div className='table-row'>
                <div className='table-cell'></div>
                <button
                  type='submit'
                  className={`block text-white rounded-sm px-6 py-2 mt-6 bg-brand hover:bg-brand-light focus:bg-brand-light`}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
          <div className='w-full lg:w-1/3 py-10 flex justify-center'>
            <div className='lg:border-l-2 lg:pl-24'>
              <img
                src={
                  currentUser.avatar != null
                    ? currentUser.avatar
                    : 'https://ik.imagekit.io/tnyyngwxvx9/default_28FGC8ZwZ.png'
                }
                alt=''
                className='w-32 h-32 rounded-full'
              />
              <div className='w-full text-center'>
                <button
                  type='button'
                  className={`text-gray-800 rounded-sm px-6 py-1 mt-6 bg-white hover:bg-gray-50 border focus:bg-gray-100 shadow-sm`}
                >
                  Chọn Ảnh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
