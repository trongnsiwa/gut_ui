import React from 'react';
import Select from 'react-select';

const TableWrapper = ({
  name,
  sorts,
  filters,
  setSelectedFilter,
  pageNum,
  setPageNum,
  totalPage,
  headers,
  rows,
  sizes,
  setPageSize,
  setSortBy,
  searchedName,
  setSeachedName,
}) => {
  return (
    <div className='2xl:container 2xl:w-3/4 mx-auto'>
      <div className='flex flex-col text-right mb-4 mt-10'>
        <div className='text-sm font-light text-gray-500'>TABLE</div>
        <div className='text-sm font-bold text-brand-dark'>
          <span>{name}</span>
        </div>
      </div>

      <div className='mb-4 flex justify-between items-center gap-2'>
        <div className={`${filters ? 'w-1/2' : 'w-3/4'}`}>
          <div className='relative'>
            <input
              type='text'
              className='w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-600'
              placeholder='Search by name...'
              value={searchedName}
              onChange={(e) => {
                setSeachedName(e.target.value);
                setPageNum(1);
              }}
            />

            <div className='absolute top-0 left-0 inline-flex items-center p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6 text-gray-400'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='0' y='0' width='24' height='24' stroke='none'></rect>
                <circle cx='10' cy='10' r='7' />
                <line x1='21' y1='21' x2='15' y2='15' />
              </svg>
            </div>
          </div>
        </div>

        <Select
          defaultValue={sorts[0]}
          options={sorts}
          onChange={({ label, value }) => {
            setPageNum(1);
            setSortBy(value);
          }}
          className='text-gray-600 w-1/4 bg-white focus:outline-none focus:shadow-outline shadow rounded-lg z-50'
        />

        {filters && (
          <Select
            defaultValue={{
              value: 'ALL',
              label: 'ALL',
            }}
            options={filters}
            onChange={({ label, value }) => {
              setSelectedFilter({
                id: value,
                name: label,
              });
              setPageNum(1);
            }}
            className='text-gray-600 w-1/4 bg-white focus:outline-none focus:shadow-outline shadow rounded-lg z-50'
          />
        )}
      </div>

      <div className='overflow-x-auto bg-white rounded-lg shadow overflow-y-auto'>
        {rows && rows.length > 0 ? (
          <>
            <table className='custom-table'>
              <thead>
                <tr className='text-left'>{headers}</tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>

            <div className='flex flex-row items-center justify-between my-4 mx-3'>
              <div className='flex flex-wrap items-center justify-start space-x-6 pagination'>
                {pageNum <= totalPage && pageNum > 1 && (
                  <button className='btn-paging' onClick={() => setPageNum(1)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                      />
                    </svg>
                  </button>
                )}
                {pageNum > 1 && (
                  <button className='btn-paging' onClick={() => setPageNum(pageNum - 1)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                    </svg>
                  </button>
                )}
                {pageNum < totalPage && pageNum > 0 && (
                  <button className='btn-paging' onClick={() => setPageNum(pageNum + 1)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </button>
                )}
                {pageNum >= 1 && pageNum < totalPage && (
                  <button className='btn-paging' onClick={() => setPageNum(totalPage)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 5l7 7-7 7M5 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                )}
              </div>
              <span>
                Page{' '}
                <b>
                  {pageNum} of {totalPage}
                </b>{' '}
              </span>
              <select
                className='form-select text-sm w-1/4 bg-white outline-none shadow-none focus:shadow-none'
                onChange={(e) => {
                  setPageNum(1);
                  setPageSize(parseInt(e.target.value));
                }}
              >
                {sizes}
              </select>
            </div>
          </>
        ) : (
          <div className='flex flex-col justify-center items-center w-full my-6 bg-white px-4 sm:px-6 lg:px-16'>
            <img
              src='https://ik.imagekit.io/tnyyngwxvx9/no-results_sbm3UFZiL.svg?updatedAt=1626878273006'
              alt='Not Found'
              className='h-24 w-24 mx-auto mb-4 text-gray-900'
            />
            <p className='text-lg leading-5 font-medium text-gray-900 mb-3'>No Result Found</p>
            <p>We did not find any items name "{searchedName}" for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableWrapper;
