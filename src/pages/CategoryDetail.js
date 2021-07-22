import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCategoryParent, getChildCategories } from '../services/category.service';

const CategoryDetail = (props) => {
  const { id } = props.match.params;
  const query = new URLSearchParams(useLocation().search);
  const isParent = query.get('parent');

  const [details, setDetails] = useState();

  useEffect(() => {
    if (isParent) {
      getCategoryParent(id)
        .then((res) => {
          console.log(res.data.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      getChildCategories(id)
        .then((res) => {
          console.log(res.data.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }, [id, isParent]);

  return <div></div>;
};

export default CategoryDetail;
