import React from 'react';
import { useDispatch } from 'react-redux';
import { clearMessage } from '../../actions/MessageAction';

const MessageModal = ({ message, action, isSuccess, setSuccess, isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSuccess(false);
      dispatch(clearMessage());
    }, 500);
  };

  return (
    <div class='min-w-screen h-screen animated fixed left-0 top-0 flex justify-center items-center inset-0 z-50'>
      <div class='absolute inset-0 z-0'>
        <div
          className={`w-3/4 sm:w-full max-w-lg p-5 relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg  bg-white ${
            isOpen ? 'animate-open' : 'animate-close'
          }`}
        >
          <div>
            <div class='text-center p-5 flex-auto justify-center'>
              {isSuccess ? (
                <img
                  src='https://ik.imagekit.io/tnyyngwxvx9/check_0ILe7D_hf.svg?updatedAt=1626768754857'
                  alt='Sucess'
                  className='w-16 h-16 flex items-center mx-auto'
                />
              ) : (
                <img
                  src='https://ik.imagekit.io/tnyyngwxvx9/error_ov8HDyUfl.svg?updatedAt=1626768831991'
                  alt='Fail'
                  className='w-16 h-16 flex items-center mx-auto'
                />
              )}
              <h2 className='text-xl font-bold py-4'>{isSuccess ? 'Success!' : 'Fail!'}</h2>
              <p className='text-sm text-gray-500 px-8'>{message}</p>
            </div>
            <div class='p-3 mt-2 text-center space-x-4 md:block'>
              <button
                class='bg-gray-500 border border-gray-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-gray-600'
                onClick={closeModal}
              >
                {action}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
