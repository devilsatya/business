import React from "react";
import { useNavigate } from "react-router-dom";
import { categoriesData1 } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const navigate = useNavigate();

  const handleSubmit = (categoryTitle, subcategoryTitle) => {
    navigate(`/subcategories?category=${categoryTitle}&subcategory=${subcategoryTitle}`);
  };

  return (
    <div
      className={`${styles.section1} bg-white p-7 rounded-lg mb-12`}
      id="categories"
    >
      <div className="overflow-x-auto">
        {/* Horizontal Scrollable Container */}
        <div className="flex flex-nowrap gap-6 sm:gap-10 overflow-x-scroll">
          {categoriesData1 &&
            categoriesData1.map((category) =>
              category.subcategories.map((subcategory) => (
                <div
                  key={subcategory.title}
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => handleSubmit(category.title, subcategory.title)}
                >
                  {/* Image Container */}
                  <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-44 lg:h-44 overflow-hidden rounded-lg shadow-md">
                    <img
                      src={subcategory.image || category.image}
                      alt={subcategory.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Optional Text Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                      <p className="text-white text-lg font-semibold">
                        {subcategory.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
