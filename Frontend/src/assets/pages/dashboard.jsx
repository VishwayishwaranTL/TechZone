import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/dashboard.css";

const AdminDashboard = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    device: "",
    category: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    discount: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const usersRes = await axios.get(`${BASE_URL}/api/admin/users`, config);
        const adminsRes = await axios.get(`${BASE_URL}/api/admin/admins`, config);
        const productsRes = await axios.get(`${BASE_URL}/api/admin/products`, config);

        setUsers(usersRes.data.success ? usersRes.data.data : []);
        setAdmins(adminsRes.data.success ? adminsRes.data.data : []);
        setProducts(productsRes.data.success ? productsRes.data.data : []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddOrUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isUpdating) {
        const res = await axios.put(`${BASE_URL}/api/admin/products/${currentProduct._id}`, productForm, config);
        if (res.data.success) {
          setProducts(products.map((p) => (p._id === currentProduct._id ? res.data.data : p)));
        }
      } else {
        const res = await axios.post(`${BASE_URL}/api/admin/products`, productForm, config);
        if (res.data.success) {
          setProducts([...products, res.data.data]);
        }
      }

      setShowModal(false);
      setIsUpdating(false);
      setCurrentProduct(null);
      setProductForm({ name: "", brand: "", device: "", category: "", price: "", description: "", image: "", stock: "", discount: "" });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setProductForm(product);
    setIsUpdating(true);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.delete(`${BASE_URL}/api/admin/products/${productId}`, config);
      if (res.data.success) {
        setProducts(products.filter((product) => product._id !== productId));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="dashboardContainer">
      <h2 className="dashboardHeading">Admin Dashboard</h2>

      <button onClick={() => { setIsUpdating(false); setShowModal(true); }} className="dashAddProductBtn">
        Add Product
      </button>

      {showModal && (
        <div className="showModal">
          <div className="showModalContainer">
            <h3 className="showHeading">{isUpdating ? "Update Product" : "Add New Product"}</h3>
            <input className="showDetails" type="text" placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            <input className="showDetails" type="text" placeholder="Brand" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
            <input className="showDetails" type="text" placeholder="Device" value={productForm.device} onChange={(e) => setProductForm({ ...productForm, device: e.target.value })} />
            <input className="showDetails" type="text" placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
            <input className="showDetails" type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
            <input className="showDetails" type="text" placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            <input className="showDetails" type="text" placeholder="Image URL" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
            <input className="showDetails" type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
            <input className="showDetails" type="number" placeholder="Discount" value={productForm.discount} onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })} />

            <div className="showBtnContainer">
              <button onClick={() => setShowModal(false)} className="showCancel">
                Cancel
              </button>
              <button onClick={handleAddOrUpdateProduct} className="showAddUpdate">
                {isUpdating ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

            <div className="dashUserContainer">
        <h3 className="dashUserHeading">Users</h3>
        {users.length > 0 ? (
          <table className="dashUserTable">
            <thead>
              <tr className="userRow">
                <th className="userHead">Name</th>
                <th className="userHead">Email</th>
                <th className="userHead">Phone</th>
                <th className="userHead">Address</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border">
                  <td className="userValue">{user.firstName} {user.lastName}</td>
                  <td className="userValue">{user.email}</td>
                  <td className="userValue">{user.phone || "N/A"}</td>
                  <td className="userValue">{user.address || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      <div className="dashAdminContainer">
        <h3 className="dashAdminHeading">Admins</h3>
        {admins.length > 0 ? (
          <table className="adminTable">
            <thead>
              <tr className="adminRow">
                <th className="adminHead">Name</th>
                <th className="adminHead">Email</th>
                <th className="adminHead">Role</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((admin) => (
                <tr key={admin._id} className="border">
                  <td className="adminValue">{admin.name}</td>
                  <td className="adminValue">{admin.email}</td>
                  <td className="adminValue">{admin.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No admins found.</p>
        )}
      </div>
    
      <div className="dashProductContainer">
        <h3 className="dashProductHeading">Products</h3>
        {products.length > 0 ? (
          <table className="productTable">
            <thead>
              <tr className="productRow">
                <th className="productHead">Name</th>
                <th className="productHead">Brand</th>
                <th className="productHead">Device</th>
                <th className="productHead">Category</th>
                <th className="productHead">Price</th>
                <th className="productHead">Discount</th>
                <th className="productHead">Discounted Price</th>
                <th className="productHead">Stock Available</th>
                <th className="productHead">Rating</th>
                <th className="productHead">Actions</th>
              </tr>
            </thead>
            <tbody>
            {products.map((product) => {
                const discountedPrice = product.discount > 0
                ? (product.price - (product.price * product.discount / 100)).toFixed(2)
                : product.price;

                return (
                <tr key={product._id} className="border">
                    <td className="productValue">{product.name}</td>
                    <td className="productValue">{product.brand}</td>
                    <td className="productValue">{product.device}</td>
                    <td className="productValue">{product.category}</td>
                    <td className="productValue">{product.price}</td>
                    <td className="productValue">{product.discount}%</td>
                    <td className="productValue">{discountedPrice}</td>
                    <td className="productValue">{product.stock}</td>
                    <td className="productValue">{product.rating || "N/A"}</td>
                    <td className="productValue">
                    <button onClick={() => handleEditProduct(product)} className="dashProductUpdateBtn">
                        Update
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="dashProductDeleteBtn">
                        Delete
                    </button>
                    </td>
                </tr>
                );
            })}
            </tbody>
          </table>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
