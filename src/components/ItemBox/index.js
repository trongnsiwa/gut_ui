import { StarIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCash } from '../../helpers/formatCash';
import useViewport from '../../helpers/useViewport';

const ItemBox = ({ item, parent, category, ranking }) => {
  const [currentImage, setCurrentImage] = useState(item?.images[0]);

  const { width } = useViewport();
  const breakpoint = 768;

  useEffect(() => {
    if (width < breakpoint) {
      setCurrentImage(item?.images[0]);
    }
  }, [item?.images, width]);

  return (
    <li className='w-full float-left mb-6 relative text-left md:border-b-0 md:text-center hover:opacity-80 p-3'>
      <div className='m-0 relative'>
        <Link
          to={{
            pathname: `/product/${item.id}`,
            state: {
              parentId: parent?.id,
              parentName: parent?.name,
              categoryId: category?.id,
              categoryName: category?.name,
            },
          }}
        >
          {ranking && (
            <>
              <span
                className='block w-0 h-0 absolute top-0 left-0 z-10 text-white text-center'
                style={{
                  borderColor: 'transparent transparent transparent #44A5CA',
                  borderStyle: 'solid',
                  borderWidth: '0px 45px 45px 45px',
                }}
              ></span>
              <span className='block w-0 h-0 absolute top-0 left-0 z-10 text-white text-center pl-2 text-sm'>
                {ranking}
              </span>
            </>
          )}
          <div className='mb-3 w-full'>
            <img className='w-full h-auto align-top' src={currentImage?.imageUrl} alt={currentImage?.title} />
          </div>
          <div className='h-auto mb-3 flex justify-center space-x-1 items-center'>
            {item?.colors?.length > 0 &&
              item.colors.map(
                (color, index) =>
                  ((width >= breakpoint && index <= 5) || (width < breakpoint && index <= 3)) &&
                  color.id >= 0 && (
                    <span
                      key={`p${item.id}_c${color.id}`}
                      className='float-left w-3 h-3 relative text-center md:float-none md:inline-block align-middle md:w-4 md:h-4'
                      onMouseOver={() =>
                        width >= breakpoint && setCurrentImage(item?.images.find((img) => img.colorCode === color.id))
                      }
                    >
                      <span
                        className={`rounded-full absolute align-middle top-0 bottom-0 left-0 right-0 m-auto cursor-pointer transform transition-all ${
                          width >= breakpoint && currentImage?.colorCode === color.id
                            ? 'border-2 border-gray-500 w-5 h-5'
                            : ''
                        }`}
                        style={{
                          backgroundColor: `${color.source}`,
                        }}
                      ></span>
                    </span>
                  )
              )}
            {((width >= breakpoint && item?.colors?.length > 6) ||
              (width < breakpoint && item?.colors?.length > 4)) && (
              <span className='float-left w-3 h-3 relative text-center md:float-none md:inline-block align-middle md:w-4 md:h-4'>
                +
              </span>
            )}
          </div>
          <div className='text-sm text-center mb-3 text-gray-600 leading-5 h-6 font-normal overflow-hidden'>
            {item.name}
          </div>
          <div className='mb-3'>
            <p
              className='text-center text-sm md:text-xl font-bold tracking-wide'
              style={{ color: `${item.salePrice ? '#fe0000' : ''}` }}
            >
              {item.salePrice ? formatCash(item.salePrice) : formatCash(item.price)}
            </p>
            <span
              className={`text-sm text-gray-500 ${
                item?.salePrice ? 'block' : 'hidden'
              } whitespace-nowrap align-baseline line-through`}
            >
              {item && formatCash(item ? item?.price : '')}
            </span>
          </div>
          {item.rate > 0 && (
            <div className='flex items-center justify-center'>
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                return (
                  <label key={`star_${ratingValue}`}>
                    <StarIcon
                      className={`star h-6 w-6 cursor-pointer transition-colors delay-75 hover:text-yellow-500 ${
                        ratingValue <= item.rate ? 'text-yellow-200' : 'text-gray-300'
                      }`}
                    />
                  </label>
                );
              })}
            </div>
          )}
        </Link>
      </div>
    </li>
  );
};

export default ItemBox;
