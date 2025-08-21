import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./products.css";
import { LuBone } from "react-icons/lu";
import { useParams, useNavigate } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";
import { IoMdArrowDropup } from "react-icons/io";

const ProductsPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null); // For toggling the filter sections
  const [cart, setCart] = useState([]);
  const [modalProduct, setModalProduct] = useState(null); // For feedback modal
  const [newFeedback, setNewFeedback] = useState(""); // Feedback input
  const [filters, setFilters] = useState({ category: "", price: "", rating: "" });

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:2151/api/products`, {
          params: { categoryNames: categoryName },
        });
        setProducts(response.data);
        setFilteredProducts(response.data); // Initially, all products are displayed
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const applyFilters = () => {
    let filtered = [...products];

    // Apply price filter
    if (filters.price) {
      if (filters.price === "under50") filtered = filtered.filter((product) => product.price < 50);
      if (filters.price === "50to100") filtered = filtered.filter((product) => product.price >= 50 && product.price <= 100);
      if (filters.price === "over100") filtered = filtered.filter((product) => product.price > 100);
    }

    // Apply rating filter
    if (filters.rating) {
      if (filters.rating === "under4") filtered = filtered.filter((product) => product.rating < 4);
      if (filters.rating === "4to4.5") filtered = filtered.filter((product) => product.rating >= 4 && product.rating <= 4.5);
      if (filters.rating === "above4.5") filtered = filtered.filter((product) => product.rating > 4.5);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [type]: value }));
  };
  const resetFilters = () => {
    setFilters({ category: "", price: "", rating: "" }); // Reset filters
    setFilteredProducts(products); // Reset to show all products
  };

  const handleAddToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast.warn("Please log in to add items to your cart.");
        navigate("/login");
        return;
      }
      const response = await axios.post("http://localhost:2151/api/cart/addToCart", {
        email: user.email,
        productId: product._id,
      });

      if (response.data.success) {
        setCart(response.data.cart);
        toast.success(`${product.name} has been added to your cart!`);
      } else {
        toast.error("Failed to add the item to the cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("An error occurred while adding the product. Please try again.");
    }
  };

  
  const openFeedbackModal = (product) => {
    setModalProduct(product);
  };

  const handleFeedbackSubmit = async () => {
    if (!newFeedback.trim()) {
      toast.warn("Feedback cannot be empty.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast.warn("Please log in to submit feedback.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `http://localhost:2151/api/products/${modalProduct._id}/feedback`,
        { feedback: newFeedback, userEmail: user.email },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response.data.success) {
        setModalProduct((prev) => ({
          ...prev,
          feedbacks: response.data.feedbacks,
        }));
        setNewFeedback("");
        toast.success("Feedback submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred while submitting feedback. Please try again.");
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="products-page">
      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="product-aside">
        <div className="aside-content">
          <div className="aside-category" onClick={() => toggle(3)}>
            <p>Price</p> {open === 3 ? <IoMdArrowDropup /> : <TiArrowSortedDown />}
          </div>
          {open === 3 && (
            <div className="aside-category-hidden product-show">
              <div className="hidden-radio-container">
                <input type="radio" name="price" onChange={() => handleFilterChange("price", "under50")} />
                <label>Under ₹50</label>
              </div>
              <div className="hidden-radio-container">
                <input type="radio" name="price" onChange={() => handleFilterChange("price", "50to100")} />
                <label>₹50 - ₹100</label>
              </div>
              <div className="hidden-radio-container">
                <input type="radio" name="price" onChange={() => handleFilterChange("price", "over100")} />
                <label>Over ₹100</label>
              </div>
            </div>
          )}

          <div className="aside-category" onClick={() => toggle(4)}>
            <p>Rating</p> {open === 4 ? <IoMdArrowDropup /> : <TiArrowSortedDown />}
          </div>
          {open === 4 && (
            <div className="aside-category-hidden product-show">
              <div className="hidden-radio-container">
                <input type="radio" name="rating" onChange={() => handleFilterChange("rating", "under4")} />
                <label>Under 4</label>
              </div>
              <div className="hidden-radio-container">
                <input type="radio" name="rating" onChange={() => handleFilterChange("rating", "4to4.5")} />
                <label>4 - 4.5</label>
              </div>
              <div className="hidden-radio-container">
                <input type="radio" name="rating" onChange={() => handleFilterChange("rating", "above4.5")} />
                <label>Above 4.5</label>
              </div>
            </div>
          )}
        </div>

        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
      
      <div className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.images[0]} alt={product.name} />
              <div className="product-info">
                <h2>{product.name}</h2>
                <div className="paragraphs-product">
                  <p>{product.description}</p>
                  <p>Price: ₹{product.price.toFixed(2)}</p>
                  <p>Rating: {product.rating}</p>
                </div>
                <button className="product-cart-button" onClick={() => handleAddToCart(product)}>
                  ADD TO CART
                  <LuBone className="bone-icon" size={18} />
                </button>
                <button  className='feedback-button' onClick={() => openFeedbackModal(product) }>Feedback</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
      
      {/* Feedback Modal */}
      {modalProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>Feedback for {modalProduct.name}</h3>
            <ul className="ulmodel">
              {modalProduct.feedbacks.map((fb, index) => (
                <li className="limodel" key={index}>
                  <strong className="emailkiclass">{fb.userEmail}:</strong> {fb.feedback} 
                </li>
              ))}
            </ul>
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Write your feedback here..."
            ></textarea>
            <button className="feedbacksubmit" onClick={handleFeedbackSubmit}>Submit Feedback</button>
            <button className="closebutton" onClick={() => setModalProduct(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
