import dayjs from 'dayjs';
import React from 'react';
import RatingStar from './RatingStar';

const ReviewForm = ({ review }) => {
  return (
    <section className='relative py-6 border-t border-gray-100 border-solid flex'>
      <div className='mr-10'>
        <span className='text-sm font-semibold text-gray-700'>{review.userName}</span>
      </div>
      <div className='w-2/3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-bold'>{review.title}</span>
          <time className='text-xs text-gray-400'>{dayjs(review.datetime).format('DD/MM/YYYY')}</time>
        </div>
        <div className='my-2 flex justify-start'>
          <RatingStar rating={review.rating} />
        </div>
        <div
          className='transform transition-all overflow-hidden overflow-ellipsis box-border'
          style={{ maxHeight: '120px' }}
        >
          <span className='text-sm'>{review.comment}</span>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;
