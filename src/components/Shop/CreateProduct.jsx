import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData1 } from "../../static/data"; // Assuming this file contains your data
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, loading } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [fabric, setFabric] = useState("");
  const [subsubcategory, setSubSubCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [variations, setVariations] = useState([]);
  const [newVariation, setNewVariation] = useState({
    color: "",
    stockXS: "",
    stockS: "",
    stockM: "",
    stockL: "",
    stockXL: "",
    stockXXL: "",
  });
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [filteredSubSubcategories, setFilteredSubSubcategories] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((prevImages) => [...prevImages, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    const categoryData = categoriesData1.find((cat) => cat.title === selectedCategory);
    setFilteredSubcategories(categoryData ? categoryData.subcategories : []);
    setSubCategory(""); // Reset subcategory when category changes
    setSubSubCategory(""); // Reset subsubcategory when subcategory changes
  };

  const handleSubCategoryChange = (selectedSubCategory) => {
    setSubCategory(selectedSubCategory);
    const subcategoryData = categoriesData1
      .find((cat) => cat.title === category)
      ?.subcategories.find((sub) => sub.title === selectedSubCategory);

    setFilteredSubSubcategories(subcategoryData ? subcategoryData.subsubcategories : []);
    setSubSubCategory(""); // Reset subsubcategory when subcategory changes
  };

  const handleImageDelete = (imageToDelete) => {
    setImages(images.filter((image) => image !== imageToDelete));
  };

  const handleVariationChange = (e) => {
    const { name, value } = e.target;
    setNewVariation({ ...newVariation, [name]: value });
  };

  const addVariation = () => {
    if (!newVariation.color || !newVariation.stockS || !newVariation.stockM || !newVariation.stockL || !newVariation.stockXL || !newVariation.stockXXL || !newVariation.stockXS) {
      toast.error("Please fill all variation fields.");
      return;
    }
  
    // Check if the color already exists in variations
    const existingVariation = variations.some((variation) =>
      variation.colors.some((color) => color.color === newVariation.color)
    );
    if (existingVariation) {
      toast.error(`${newVariation.color} is already added. Please select a different color.`);
      return; // Do not add the variation if the color already exists
    }
  
    // Add the new color to the variations list
    setVariations([
      ...variations,
      { colors: [{ color: newVariation.color, stockXS: newVariation.stockXS, stockS: newVariation.stockS, stockM: newVariation.stockM, stockL: newVariation.stockL, stockXL: newVariation.stockXL, stockXXL: newVariation.stockXXL }] }
    ]);
  
    // Reset the newVariation state
    setNewVariation({
      color: "",
      stockXS: "",
      stockS: "",
      stockM: "",
      stockL: "",
      stockXL: "",
      stockXXL: "",
    });
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();
    images.forEach((image) => newForm.append("images", image)); // Appending image URLs
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("subcategory", subcategory);
    newForm.append("subsubcategory", subsubcategory);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("fabric", fabric);
    newForm.append("variations", JSON.stringify(variations));
    newForm.append("shopId", seller._id);

    dispatch(createProduct({
      name,
      description,
      category,
      subcategory,
      subsubcategory,
      tags,
      originalPrice,
      discountPrice,
      fabric,
      variations,
      shopId: seller._id,
      images,
    }));
  };

  return (
    <div className="w-full  800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categoriesData1.map((i) => (
              <option value={i.title} key={i.title}>
                {i.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="pb-2">
            SubCategory <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={subcategory}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            disabled={!filteredSubcategories.length}
          >
            <option value="">Choose a subcategory</option>
            {filteredSubcategories.map((sub) => (
              <option value={sub.title} key={sub.title}>
                {sub.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="pb-2">
            SubSubCategory <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={subsubcategory}
            onChange={(e) => setSubSubCategory(e.target.value)}
            disabled={!filteredSubSubcategories.length}
          >
            <option value="">Choose a subsubcategory</option>
            {filteredSubSubcategories.map((subsub) => (
              <option value={subsub.title} key={subsub.title}>
                {subsub.title}
              </option>
            ))}
          </select>
        </div>

        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Fabric</label>
          <input
            type="text"
            name="tags"
            value={fabric}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setFabric(e.target.value)}
            placeholder="Enter fabric details..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter original price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Discount Price</label>
          <input
            type="number"
            name="discountPrice"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter discount price..."
          />
        </div>
        <br />
        {/* Variations Section */}
        <br />
        <div>
          <label className="pb-2">Variations</label>
          <div className="flex">
            <input
              type="text"
              name="color"
              value={newVariation.color}
              onChange={handleVariationChange}
              placeholder="Color"
              className="w-[15%] mr-2"
            />
            <input
              type="number"
              name="stockXS"
              value={newVariation.stockXS}
              onChange={handleVariationChange}
              placeholder="XS"
              className="w-[10%] mr-2"
            />
            <input
              type="number"
              name="stockS"
              value={newVariation.stockS}
              onChange={handleVariationChange}
              placeholder="S"
              className="w-[10%] mr-2"
            />
            <input
              type="number"
              name="stockM"
              value={newVariation.stockM}
              onChange={handleVariationChange}
              placeholder="M"
              className="w-[10%] mr-2"
            />
            <input
              type="number"
              name="stockL"
              value={newVariation.stockL}
              onChange={handleVariationChange}
              placeholder="L"
              className="w-[10%] mr-2"
            />
            <input
              type="number"
              name="stockXL"
              value={newVariation.stockXL}
              onChange={handleVariationChange}
              placeholder="XL"
              className="w-[10%] mr-2"
            />
            <input
              type="number"
              name="stockXXL"
              value={newVariation.stockXXL}
              onChange={handleVariationChange}
              placeholder="XXL"
              className="w-[10%] mr-2"
            />
          
          </div>
          <br />
          <button type="button" onClick={addVariation} className="flex justify-center items-center mt-2 w-[25%] h-[30px] bg-sky-500 text-white rounded-[5px]">
            Add Variation
          </button>
        </div>
        <br />
        <br />
        <div>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Color</th>
                <th>XS</th>
                <th>S</th>
                <th>M</th>
                <th>L</th>
                <th>XL</th>
                <th>XXL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {variations.map((variation, index) => (
                <tr key={index}>
    <td>{variation.colors[0].color}</td>
                  <td>{variation.colors[0].stockXS}</td>
                  <td>{variation.colors[0].stockS}</td>
                  <td>{variation.colors[0].stockM}</td>
                  <td>{variation.colors[0].stockL}</td>
                  <td>{variation.colors[0].stockXL}</td>
                  <td>{variation.colors[0].stockXXL}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Image Upload Section */}
        <div>
          <label className="pb-2">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full mt-2"
          />
          <div className="flex mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative mr-2">
                <img
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-[100px] h-[100px] object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(image)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <br />
     <button
          type="submit"
          className="w-full h-[40px] text-white font-semibold bg-sky-500 rounded-[5px]"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
