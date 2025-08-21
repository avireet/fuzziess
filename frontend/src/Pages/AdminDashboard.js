import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Create a CSS file for styling

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        rating: '',
        images: '',
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:2151/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const imageUrls = formData.images.split(',').map(url => url.trim());
            const dataToSend = { ...formData, images: imageUrls };

            if (editingProductId) {
                await axios.put(`http://localhost:2151/api/products/${editingProductId}`, dataToSend);
                setFeedbackMessage('Product updated successfully!');
            } else {
                await axios.post('http://localhost:2151/api/products/create', dataToSend);
                setFeedbackMessage('Product created successfully!');
            }

            fetchProducts();
            setFormData({ name: '', description: '', price: '', category: '', rating: '', images: '' });
            setEditingProductId(null);
        } catch (error) {
            console.error('Error submitting form:', error);
            setFeedbackMessage('An error occurred. Please try again.');
        }
    };

    const handleEdit = (product) => {
        setFormData({ 
            name: product.name, 
            description: product.description, 
            price: product.price, 
            category: product.category.name, 
            rating: product.rating,
            images: product.images.join(', ')
        });
        setEditingProductId(product._id);
        setFeedbackMessage(''); // Clear feedback message when editing
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:2151/api/products/${id}`);
            fetchProducts();
            setFeedbackMessage('Product deleted successfully!');
        } catch (error) {
            console.error('Error deleting product:', error);
            setFeedbackMessage('An error occurred while deleting the product.');
        }
    };

    return (
        <div className="admin-dashboard">
            {feedbackMessage && <div className="feedback-message">{feedbackMessage}</div>}
            <form onSubmit={handleSubmit} className="product-form">
                <h2>{editingProductId ? 'Edit Product' : 'Create New Product'}</h2>
                <div className="form-group">
                    <label>Product Name:</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input name="price" value={formData.price} onChange={handleChange} type="number" required />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <input name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Rating:</label>
                    <input name="rating" value={formData.rating} onChange={handleChange} type="number" required />
                </div>
                <div className="form-group">
                    <label>Image URLs (comma separated):</label>
                    <input name="images" value={formData.images} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-button">
                    {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
            </form>
            <div className='admin-product-list'>
            <h2>Product List</h2>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product._id} className="product-item">
                        <div className='admin-product-name'>
                            {product.name} - ${product.price}
                        </div>
                        <button onClick={() => handleEdit(product)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
                    </li>
                ))}
            </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;