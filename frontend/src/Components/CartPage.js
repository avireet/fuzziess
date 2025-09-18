import React, { useEffect, useState } from 'react';
import './cart.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartCard from './CartCard';
import StripeCheckout from 'react-stripe-checkout'; // Import StripeCheckout
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import BillingForm from "../Pages/BillingForm"; // Import BillingForm

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0); // State to store total amount
    const [shipmentDetails, setShipmentDetails] = useState({}); // State to store shipment details
    const [paymentSuccess, setPaymentSuccess] = useState(false); // State for tracking payment success

    const user = JSON.parse(localStorage.getItem('user'));
    const email = user ? user.email : null;

    // Fetch cart data from the backend
    const fetchUserCart = async () => {
        try {
            const response = await axios.post('https://fuzziess-vx0m.onrender.com/api/cart', { email });
            if (response.data.success) {
                setCart(response.data.cart); // Update cart state with fetched data
                calculateTotal(response.data.cart); // Calculate total amount
            } else {
                setError('Failed to fetch cart data.');
            }
        } catch (error) {
            setError('Error fetching cart data.');
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate total amount for cart
    const calculateTotal = (cartItems) => {
        let total = 0;
        cartItems.forEach((item) => {
            total += item.productId.price * item.quantity; // Multiply price by quantity for each item
        });
        setTotalAmount(total); // Set total amount in state
    };

    // Clear cart data (Frontend + Backend synchronization)
    const clearCart = async () => {
        try {
            const response = await axios.post('https://fuzziess-vx0m.onrender.com/api/cart/clearCart', { email });
            if (response.data.success) {
                setCart([]); // Clear cart state locally
                setTotalAmount(0); // Reset total amount
                console.log('Cart cleared successfully on server and frontend.');
                toast.success('Cart has been cleared!');
            } else {
                throw new Error('Failed to clear cart on the server.');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Error clearing cart. Please try again.');
        }
    };

    // Handle Stripe payment token and shipment details
    const handleToken = async (token) => {
        try {
            // Extract addresses from the token object
            const shipmentDetails = {
                name: token.card.billing_address_name || 'Unknown',
                address: token.card.billing_address_line1 || 'Not Available',
                city: token.card.billing_address_city || 'Not Available',
                postcode: token.card.billing_address_zip || 'Not Available',
                phone: token.card.billing_address_country || 'Not Available',
            };

            setShipmentDetails(shipmentDetails); // Save shipment details in state
             // Fix amount calculation
        const roundedAmount = Math.round(totalAmount * 100); // Convert to paise/cents

            // Stripe payment API request
            const response = await axios.post('https://fuzziess-vx0m.onrender.com/api/payment/checkout', {
                token: token.id,
                amount: roundedAmount, // Amount in cents for Stripe
                currency: 'INR',
            });

            if (response.status === 200 && response.data.success) {
              
                 await clearCart(); // Clear the cart
                setPaymentSuccess(true);
                toast.success('Payment Successful!');

                navigate('/form', {
                    state: {
                        paymentReceipt: response.data.receiptUrl, // Payment receipt URL
                        totalAmount: totalAmount,
                    },
                });
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            toast.error('Payment failed! Please try again.');
        }
    };

    // Remove item from cart
    const removeFromCart = async (productId) => {
        try {
            const response = await axios.delete('https://fuzziess-vx0m.onrender.com/api/cart/removeFromCart', {
                data: { email, productId },
            });
            if (response.data.success) {
                const updatedCart = cart.filter((item) => item.productId._id !== productId);
                setCart(updatedCart);
                calculateTotal(updatedCart); // Recalculate total
                toast.success('Item removed from cart!');
            } else {
                toast.error('Failed to remove item from cart.');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Error removing item from cart.');
        }
    };

    // Update cart quantity
    const updateCartQuantity = (productId, quantity) => {
        const updatedCart = cart.map((item) => {
            if (item.productId._id === productId) {
                item.quantity = quantity;
            }
            return item;
        });
        setCart(updatedCart);
        calculateTotal(updatedCart); // Recalculate total with updated quantities
    };

    // Fetch user cart on component mount or when email changes
    useEffect(() => {
        if (email) {
            fetchUserCart();
        } else {
            setError('No user email found.');
            setLoading(false);
        }
    }, [email]);

    if (loading) return <div className="loading">Loading cart...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <main>
            <div className="main-color"></div>
            <div className="cartPage-container">
                {cart.length > 0 ? (
                    <div className="checkout cart-items">
                        <h2 className="shopping-cart">Your Shopping Cart</h2>
                        <div className="cart-items-container">
                        <div className='cart-div'>
                        
                        {cart.map((item) => (
                            <CartCard
                                key={item._id}
                                item={item}
                                removeFromCart={removeFromCart}
                                updateCartQuantity={updateCartQuantity} // Pass the update function as a prop
                            />
                        ))}
                         </div>
<div className='aside-cart'>
                        <div className="total-amount">
                            <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
                        </div>

                        <StripeCheckout
                            stripeKey="pk_test_51QRqmdAyGJh6v8kKbXdiwTGWQ9hcqVvYJgFkTPcJ6D9rLxcqjWlMzmnntA66J4jJcvlZH6PHOge4qXowbxyCBVMo001Azf7VzO"
                            token={handleToken}
                            amount={totalAmount * 100} // Stripe requires amount in cents
                            currency="INR"
                            name="FUZZIES"
                            billingAddress={true}
                            shippingAddress={true}
                        >
                            <button className="buy-now-button">Buy Now</button>
                        </StripeCheckout>
                        </div>
                        </div>
                    </div>
                ) : (
                    <div className="checkout empty-cart">
                        <h2 className="shopping-cart">Your Shopping Cart is Empty</h2>
                        <img src="cart-img.svg" alt="empty-cart" />
                        <button className="button-cart-click" onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
            <ToastContainer /> {/* Toast notification container */}
        </main>
    );
};

export default CartPage;
