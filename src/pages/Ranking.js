import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ItemBox from '../components/ItemBox';
import { getAllParentCategories } from '../services/category.service';
import { getProducts, getProductsByCategory } from '../services/product.service';

const Ranking = () => {
  const [selectedParent, setSelectedParent] = useState(null);
  const [parentCategories, setParentCategories] = useState(null);
  const [products, setProducts] = useState();
  const pageNum = 1;
  const pageSize = 30;

  useEffect(() => {
    getAllParentCategories().then(
      (res) => {
        setParentCategories(res.data.data);
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        console.log(message);
      }
    );
  }, []);

  useEffect(() => {
    if (selectedParent == null) {
      getProducts(pageNum, pageSize, 'DEFAULT', null, null, null, null, null).then(
        (res) => {
          setProducts(res.data.data);
        },
        (error) => {
          const message =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

          console.log(message);
        }
      );
    } else {
      getProductsByCategory(selectedParent.id, pageNum, pageSize, 'DEFAULT', null, null, null, null, null).then(
        (res) => {
          setProducts(res.data.data);
        },
        (error) => {
          const message =
            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

          console.log(message);
        }
      );
    }
  }, [selectedParent]);

  return (
    <>
      <div className='mx-auto w-full text-black'>
        {products && products.length > 0 && (
          <>
            <section
              id='sale_section'
              className='w-full'
              style={{ paddingBottom: '50px', borderBottom: '1px solid #E3E3E3' }}
            >
              <div className='my-20'>
                <h2 className='text-center text-xl md:text-3xl tracking-wide font-bold text-brand-darker'>XẾP HẠNG</h2>
                <p className='text-sm text-center'>xếp hạng</p>
              </div>
              <div className='py-3 text-sm md:text-base flex bg-gray-100 justify-center'>
                <div
                  onClick={() => {
                    setSelectedParent(null);
                  }}
                  className={`${
                    selectedParent === null ? 'font-bold border-b-2 border-black' : ''
                  } px-3 py-2 cursor-pointer hover:border-b-2 border-black`}
                >
                  <span>Tất cả</span>
                </div>
                {parentCategories &&
                  parentCategories?.map(
                    (parent) =>
                      !parent.deleted && (
                        <div
                          key={parent.id}
                          onClick={() => {
                            if (selectedParent?.id === parent.id) {
                              setSelectedParent(null);
                              return;
                            }
                            setSelectedParent(parent);
                          }}
                          className={`${
                            selectedParent?.id === parent.id ? 'font-bold border-b-2 border-black' : ''
                          } px-3 py-2 cursor-pointer hover:border-b-2 border-black`}
                        >
                          <span>{parent.name}</span>
                        </div>
                      )
                  )}
              </div>
              <div className='md:container pb-10 px-10 table w-full mt-10'>
                <div className='mt-5 md:mt-0 md:table-cell'>
                  <div className='relative'>
                    <ul style={{ width: '680px!important' }} className='grid grid-cols-5'>
                      {products &&
                        products.map((item, index) => <ItemBox item={item} key={item.id} ranking={index + 1} />)}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Ranking;
