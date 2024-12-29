import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { FaFilter, FaSort, FaTimes } from "react-icons/fa";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const priceRange = searchParams.get("price");
  const ratingFilter = searchParams.get("rating");
  const sortOption = searchParams.get("sort");

  const { allProducts = [], isLoading } = useSelector((state) => state.products);

  const [data, setData] = useState([]);
  const [noProducts, setNoProducts] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  useEffect(() => {
    if (!Array.isArray(allProducts)) {
      setData([]);
      setNoProducts(true);
      return;
    }

    let sortedProducts = [...allProducts];

    // Sorting logic
    if (sortOption) {
      sortedProducts = sortedProducts.sort((a, b) => {
        const priceA = a.discountPrice ? parseFloat(a.discountPrice) : 0;
        const priceB = b.discountPrice ? parseFloat(b.discountPrice) : 0;
        const ratingA = a.rating ? parseFloat(a.rating) : 0;
        const ratingB = b.rating ? parseFloat(b.rating) : 0;

        if (sortOption === "price-asc") return priceA - priceB;
        if (sortOption === "price-desc") return priceB - priceA;
        if (sortOption === "rating-asc") return ratingA - ratingB;
        if (sortOption === "rating-desc") return ratingB - ratingA;
        return 0;
      });
    }

    // Apply filters
    let filteredProducts = sortedProducts;

    // Filter by category
    if (categoryData) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === categoryData
      );
    }

    // Filter by price range
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.discountPrice >= minPrice && product.discountPrice <= maxPrice
        );
      }
    }

    // Filter by rating
    if (ratingFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.rating >= Number(ratingFilter)
      );
    }

    setData(filteredProducts);
    setNoProducts(filteredProducts.length === 0);
  }, [categoryData, priceRange, ratingFilter, sortOption, allProducts]);

  const handleFilterChange = (filterType, value) => {
    if (value) {
      searchParams.set(filterType, value);
    } else {
      searchParams.delete(filterType);
    }
    setSearchParams(searchParams);
  };

  const toggleFilter = () => setFilterVisible(!filterVisible);
  const toggleSort = () => setSortVisible(!sortVisible);

  const closeFilterSidebar = () => setFilterVisible(false);
  const closeSortSidebar = () => setSortVisible(false);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <br />
          <br />

          <div className={`${styles.section} flex`}>
            {/* Filter Sidebar */}
            <div
              className={`fixed top-0 left-0 z-50 h-full bg-white p-4 border-r-2 transition-transform duration-300 ease-in-out ${filterVisible ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:block md:w-[20%] lg:w-[20%]`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Filters</h3>
                {/* Close button only visible on mobile devices */}
                <FaTimes
                  className="cursor-pointer text-red-500 md:hidden"
                  onClick={closeFilterSidebar}
                />
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Category</h4>
                <select
                  value={categoryData || ""}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full mt-2 border rounded-md p-2"
                >
                  <option value="">All Categories</option>
                  {Array.from(new Set(allProducts.map((product) => product.category))).map(
                    (category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mt-4">
                <h4 className="font-medium">Price Range</h4>
                <select
                  value={priceRange || ""}
                  onChange={(e) => handleFilterChange("price", e.target.value)}
                  className="w-full mt-2 border rounded-md p-2"
                >
                  <option value="">All Prices</option>
                  <option value="0-50">0 - 50</option>
                  <option value="50-100">51 - 100</option>
                  <option value="100-200">101 - 200</option>
                  <option value="200-500">201 - 500</option>
                  <option value="500-1000">501 - 1000</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mt-4">
                <h4 className="font-medium">Ratings</h4>
                <select
                  value={ratingFilter || ""}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="w-full mt-2 border rounded-md p-2"
                >
                  <option value="">All Ratings</option>
                  <option value="1">1 & Above</option>
                  <option value="2">2 & Above</option>
                  <option value="3">3 & Above</option>
                  <option value="4">4 & Above</option>
                  <option value="5">5</option>
                </select>
              </div>

              {/* Sort option on desktop, placed after filters */}
              <div className="mt-6">
                <h4 className="font-medium">Sort By</h4>
                <select
                  value={sortOption || ""}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full mt-2 border rounded-md p-2"
                >
                  <option value="">Select Sort Option</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                  <option value="rating-desc">Rating: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="w-full md:w-[80%] lg:w-[80%] p-4">
              <div className="grid grid-cols-2 gap-[20px] sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                {data.length > 0 ? (
                  data.map((product, index) => <ProductCard data={product} key={index} />)
                ) : (
                  <p>No products found</p>
                )}
              </div>
            </div>
          </div>

          {/* Filter and Sort Buttons (Visible only on mobile/tablet) */}
          <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-4 flex justify-between">
            {/* Filter Button */}
            <button
              onClick={toggleFilter}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            >
              <FaFilter size={20} />
              <span>Filter</span>
            </button>
            {/* Sort Button */}
            <button
              onClick={toggleSort}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600"
            >
              <FaSort size={20} />
              <span>Sort</span>
            </button>
          </div>

          {/* Sort Sidebar */}
          <div
            className={`fixed top-0 left-0 z-50 h-full bg-white p-4 border-r-2 transition-transform duration-300 ease-in-out ${sortVisible ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:block md:w-[20%]`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Sort By</h3>
              {/* Close button only visible on mobile devices */}
              <FaTimes
                className="cursor-pointer text-red-500 md:hidden"
                onClick={closeSortSidebar}
              />
            </div>
            <div className="mt-4">
              <select
                value={sortOption || ""}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full mt-2 border rounded-md p-2"
              >
                <option value="">Select Sort Option</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
