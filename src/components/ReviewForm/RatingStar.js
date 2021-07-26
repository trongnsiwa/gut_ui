import React from 'react';

const RatingStar = ({ rating }) => {
  return (
    <div className='flex items-center mt-2 mb-4'>
      <svg
        className={`mr-1 w-3 h-3 fill-current ${rating > 0 ? 'text-yellow-500' : 'text-gray-400'}`}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
      >
        <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
      </svg>
      <svg
        className={`mr-1 w-3 h-3 fill-current ${rating > 1 ? 'text-yellow-500' : 'text-gray-400'}`}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
      >
        <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
      </svg>
      <svg
        className={`mr-1 w-3 h-3 fill-current ${rating > 2 ? 'text-yellow-500' : 'text-gray-400'}`}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
      >
        <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
      </svg>
      <svg
        className={`mr-1 w-3 h-3 fill-current ${rating > 3 ? 'text-yellow-500' : 'text-gray-400'}`}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
      >
        <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
      </svg>
      <svg
        className={`mr-1 w-3 h-3 fill-current ${rating === 5 ? 'text-yellow-500' : 'text-gray-400'}`}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
      >
        <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
      </svg>
    </div>
  );
};

export default RatingStar;
