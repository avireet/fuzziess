import React, { useState, useEffect } from "react";
import axios from "axios";
import "./billing.css"; // Import your updated CSS

const BillingPage = () => {
    const [billingInfo, setBillingInfo] = useState([]);

    useEffect(() => {
        // Fetch billing details from the backend after payment is made
        const fetchBillingDetails = async () => {
            const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data
            const email = user ? user.email : null; // Get the email from localStorage
            try {
                const response = await axios.get(`http://localhost:2151/api/billing?email=${email}`);
                console.log('API Response:', response.data); // Log the entire response
                setBillingInfo(response.data.billing); // Set all billing records
            } catch (error) {
                console.error("Error fetching billing details:", error);
            }
        };

        fetchBillingDetails();
    }, []);  // Empty dependency array means it runs only once after the component mounts

    return (
        <div className="billing-container">
            <h1>Billing Information</h1>
            {billingInfo.length > 0 ? (
                <div className="billing-cards">
                    {billingInfo.map((billing, index) => (
                        <div className="billing-card" key={index}>
                            <h3>Bill #{index + 1}</h3>
                            <div className="billing-details">
                                <div className="billing-item">
                                    <strong>Shipment Address:</strong>
                                    <p>{billing.shipmentDetails?.address || "Not Available"}</p>
                                </div>
                                <div className="billing-item">
                                    <strong>City:</strong>
                                    <p>{billing.shipmentDetails?.city || "Not Available"}</p>
                                </div>
                                <div className="billing-item">
                                    <strong>Zip Code:</strong>
                                    <p>{billing.shipmentDetails?.zipCode || "Not Available"}</p>
                                </div>
                                <div className="billing-item">
                                    <strong>Phone:</strong>
                                    <p>{billing.shipmentDetails?.phone || "Not Available"}</p>
                                </div>
                                <div className="billing-item">
                                    <strong>Total Amount:</strong>
                                    <p>₹{billing.totalAmount || "Not Available"}</p>
                                </div>
                                <div className="billing-item">
                                    <strong>Payment Status:</strong>
                                    <p>{billing.paymentStatus || "Not Available"}</p>
                                </div>
                                <div className="billing-item">
                                    <strong>Payment Receipt:</strong>
                                    <a href={billing.paymentReceipt} target="_blank" rel="noopener noreferrer">
                                        View Receipt
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="noBill">No billing information available.</p>
            )}
        </div>
    );
};

export default BillingPage;
