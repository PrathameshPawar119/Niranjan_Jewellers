import React, { useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const Add = ({ url }) => {
  const location = useLocation();
  const existingJewel = location.state?.jewel || null;

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Rings",
    subcategory: "Gold",
    size: "1",
    gender: "Women",
  });

  const bangleSizes = ["2-2", "2-4", "2-6", "2-8", "2-10", "2-12"];
  const chainSizes = ["16 inch", "18 inch", "20 inch", "22 inch", "24 inch", "30 inch"];
  const defaultSizes = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  const [sizeOptions, setSizeOptions] = useState(defaultSizes);

  useEffect(() => {
    if (existingJewel) {
      setData(existingJewel);
      setImage(existingJewel.image || ""); // Ensure image is not null
    }
  }, [existingJewel]);
  
//Update size options based on category
  useEffect(() => {
    if (data.category === "Bangles") {
      setSizeOptions(bangleSizes);
      setData((prev) => ({ ...prev, size: bangleSizes[0] }));
    } else if (data.category === "Mangalsutra" || data.category === "Gold Chain") {
      setSizeOptions(chainSizes);
      setData((prev) => ({ ...prev, size: chainSizes[0] }));
    } else {
      setSizeOptions(defaultSizes);
      setData((prev) => ({ ...prev, size: defaultSizes[0] }));
    }
  }, [data.category]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", existingJewel ? existingJewel._id : "");
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("gender", data.gender);
    formData.append("size", data.size);

    if (image instanceof File || (!existingJewel || image !== existingJewel.image)) {
      formData.append("image", image);
    }

    try {
      const url = existingJewel
        ? "http://localhost:3001/api/auth/jewellery/update"
        : "http://localhost:3001/api/auth/jewellery";

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);

        // Reset form after successful submission
        setData({
          name: "",
          description: "",
          price: "",
          category: "Rings",
          subcategory: "Gold",
          size: defaultSizes[0],
          gender: "Women",
        });
        setImage(null);

        // Refresh the page to show updated list
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update jewellery");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={
                image instanceof File
                  ? URL.createObjectURL(image)
                  : image || assets.upload_area // Ensure fallback
              }
              alt="Jewellery Preview"
            />
          </label>
          <input
            onChange={(e) => {
              const file = e.target.files[0];
              // ✅ Check if the selected file is an image
              if (file && file.type.startsWith("image/")) {
                setImage(file);
              } else {
                toast.error("Please upload a valid image file (JPG, PNG, JPEG, GIF)");
                e.target.value = ""; // Reset input if invalid file
              }
            }}
            type="file"
            id="image"
            hidden
            required={!existingJewel}
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type here" required />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write content here" required></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Rings">Rings</option>
              <option value="Bangles">Bangles</option>
              <option value="Earrings">Earrings</option>
              <option value="Mangalsutra">Mangalsutra</option>
              <option value="Gold Chain">Gold Chain</option>
              <option value="Anklet">Anklet</option>
              <option value="Gold Coin & Bars">Gold Coin & Bars</option>
              <option value="Silver Coin & Bars">Silver Coin & Bars</option>
            </select>
          </div>

          <div className="add-subcategory flex-col">
            <p>Product Metal</p>
            <select onChange={onChangeHandler} name="subcategory" value={data.subcategory}>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Platinum">Platinum</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>

          <div className="size flex-col">
            <p>Size</p>
            <select name="size" onChange={onChangeHandler} value={data.size}>
              {sizeOptions.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="gender flex-col">
            <p>Select gender</p>
            <select onChange={onChangeHandler} name="gender" value={data.gender}>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="Price" required />
          </div>
        </div>

        <button type="submit" className="add-btn">{existingJewel ? "UPDATE" : "ADD"}</button>
      </form>
    </div>
  );
};

export default Add;