import React, { useEffect, useState } from "react";
import "../css/dashboard.css";

const AddProductModal = ({ isOpen, onClose, onAdd, productToUpdate, onUpdate }) => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    brand: '',
    category: '',
    price: 0,
    discount: 0,
    stock: 0,
    rating: 0,
    device: '',
    image: null,
  });

  useEffect(() => {
    if (productToUpdate) {
      setProductDetails(productToUpdate);
    }
  }, [productToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductDetails((prevState) => ({ ...prevState, image: file }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (productToUpdate) {
        await onUpdate(productDetails); 
      } else {
        await onAdd(productDetails); 
      }
      onClose(); 
    } catch (err) {
      console.error("Error in handleSubmit:", err);
    }
  };
  console.log("Modal isOpen:", isOpen);
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{productToUpdate ? "Update Product" : "Add New Product"}</h2>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productDetails.name}
            onChange={handleChange}
            placeholder="Product Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {productDetails.image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(productDetails.image)}
                alt="Product Preview"
                className="image-preview-img"
              />
            </div>
          )}
        </div>

        <button onClick={handleSubmit}>
          {productToUpdate ? "Update Product" : "Add Product"}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddProductModal;
