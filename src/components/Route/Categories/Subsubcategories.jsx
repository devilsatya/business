import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { categoriesData1 } from "../../../static/data";
import styles from "../../../styles/styles";
import Header from '../../Layout/Header'
const Subsubcategories = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryTitle = searchParams.get("category");
  const subcategoryTitle = searchParams.get("subcategory");
  const [subsubcategories, setSubsubcategories] = useState([]);

  useEffect(() => {
    // Find the subcategory and fetch its subsubcategories
    const category = categoriesData1.find((cat) => cat.title === categoryTitle);
    const subcategory = category?.subcategories.find(
      (sub) => sub.title === subcategoryTitle
    );
    setSubsubcategories(subcategory?.subsubcategories || []);
  }, [categoryTitle, subcategoryTitle]);

  const handleProductNavigation = (subsubcategory) => {
    // Redirect to the products page with selected subsubcategory
    navigate(
      `/products?category=${categoryTitle}&subcategory=${subcategoryTitle}&subsubcategory=${subsubcategory.title}`
    );
  };

  return (
    <>
    <Header/>
    <div className={`${styles.section} bg-white p-4 rounded-lg mb-12`}>
    
      <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
        {subsubcategories.length > 0 ? (
          subsubcategories.map((subsubcategory, index) => (
            <div
              key={index}
              className="w-full h-auto flex flex-col justify-between cursor-pointer overflow-hidden p-4 border rounded shadow hover:shadow-lg transition-all"
              onClick={() => handleProductNavigation(subsubcategory)}
            >
              <img
                src={subsubcategory.image}
                alt={subsubcategory.title}
                className="w-full h-[220px] object-cover rounded mb-2"
              />
              <h5 className="text-[16px] font-semibold text-center">
                {subsubcategory.title}
              </h5>
            </div>
          ))
        ) : (
          <p className="text-center w-full text-gray-500">No subsubcategories found!</p>
        )}
      </div>
    </div>
    </>
  );
};

export default Subsubcategories;
