import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData1 } from "../../static/data"; // Assuming the categories data
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, loading } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [fabric, setFabric] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [subsubcategory, setSubSubCategory] = useState(""); // Fix here
  const [stockXS, setStockXS] = useState();
  const [stockS, setStockS] = useState();
  const [stockM, setStockM] = useState();
  const [stockL, setStockL] = useState();
  const [stockXL, setStockXL] = useState();
  const [stockXXL, setStockXXL] = useState();

  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [filteredSubSubcategories, setFilteredSubSubcategories] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);
  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : "";

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [dispatch, error, success]);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageDelete = (image) => {
    setImages(images.filter((img) => img !== image));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !category || !originalPrice || !discountPrice || !startDate || !endDate) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const newForm = new FormData();
    images.forEach((image) => {
      newForm.append("images", image);
    });

    const data = {
      name,
      description,
      category,
      subcategory,
      subsubcategory,
      fabric,
      tags,
      originalPrice,
      discountPrice,
      stockXS,
      stockS,
      stockM,
      stockL,
      stockXL,
      stockXXL,
      images,
      shopId: seller._id,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString(),
    };

    dispatch(createevent(data));
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Event</h5>
      <form onSubmit={handleSubmit}>
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
            placeholder="Enter your event product name..."
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
            placeholder="Enter your event product description..."
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

        {/* Stock Inputs */}
        <div>
          <label className="pb-2">Stock (XS)</label>
          <input
            type="number"
            name="stockXS"
            value={stockXS}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStockXS(e.target.value)}
            placeholder="Enter XS stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Stock (S)</label>
          <input
            type="number"
            name="stockS"
            value={stockS}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStockS(e.target.value)}
            placeholder="Enter S stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Stock (M)</label>
          <input
            type="number"
            name="stockM"
            value={stockM}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStockM(e.target.value)}
            placeholder="Enter M stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Stock (L)</label>
          <input
            type="number"
            name="stockL"
            value={stockL}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStockL(e.target.value)}
            placeholder="Enter L stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Stock (XL)</label>
          <input
            type="number"
            name="stockXL"
            value={stockXL}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStockXL(e.target.value)}
            placeholder="Enter XL stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Stock (XXL)</label>
          <input
            type="number"
            name="stockXXL"
            value={stockXXL}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStockXXL(e.target.value)}
            placeholder="Enter XXL stock..."
          />
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
        {/* Add other stock sizes here */}
        <div>
          <label className="pb-2">
            Original Price <span className="text-red-500">*</span>
          </label>
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
          <label className="pb-2">
            Discount Price <span className="text-red-500">*</span>
          </label>
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

        {/* Image Upload */}
        <div>
          <label className="pb-2">Images</label>
          <input
            type="file"
            name="images"
            className="mt-2 block w-full px-3 py-1.5 h-[35px] border border-gray-300 rounded-[3px]"
            onChange={handleImageChange}
            multiple
            accept="image/*"
          />
          <div className="mt-4 grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Event ${index}`} className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 bg-white rounded-full shadow"
                  onClick={() => handleImageDelete(image)}
                >
                  <AiOutlineDelete className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <br />

        {/* Dates */}
        <div>
          <label className="pb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
          />
        </div>
        <br />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-[5px] hover:bg-blue-600"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
