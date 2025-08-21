import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import './billingform.css';

const BillingForm = ({ setPaymentReceipt = () => {}, setShipmentDetails = () => {} }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Destructure paymentReceipt and totalAmount from location state
    const { paymentReceipt, totalAmount } = location.state || {};

    const [shipmentDetailsInput, setShipmentDetailsInput] = useState({
        address: "",
        city: "",
        phone: "",
        zipCode: "",
    });

    useEffect(() => {
        // Debugging logs for paymentReceipt and totalAmount
        console.log("Payment Receipt:", paymentReceipt);
        console.log("Total Amount:", totalAmount);
    }, [paymentReceipt, totalAmount]);

    if (!paymentReceipt || !totalAmount) {
        console.error("Payment receipt or total amount is missing!");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data
        const email = user ? user.email : null;

        if (!paymentReceipt || !totalAmount) {
            console.error("Payment receipt or total amount is missing!");
            return; // Prevent submission if data is missing
        }

        // Prepare billing data
        const billingData = {
            email: email,
            shipmentDetails: shipmentDetailsInput,
            totalAmount: totalAmount,
            paymentReceipt: paymentReceipt,
        };

        console.log("Billing Data:", billingData);

        try {
            const response = await axios.post(
                "http://localhost:2151/api/billing",
                billingData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.success) {
                setPaymentReceipt(response.data.billing.paymentReceipt);
                setShipmentDetails(shipmentDetailsInput);
                console.log("Billing details saved successfully");
                navigate("/billing"); // Navigate to the billing page
            }
        } catch (error) {
            console.error("Error saving billing details:", error);
        }
    };

    return (
        <div className="billing-container-details">
        <div className="billing-form-container">
            <h2 className="form-title">Billing Details</h2>
            <form className="billing-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-input"
                        value={shipmentDetailsInput.address}
                        onChange={(e) =>
                            setShipmentDetailsInput({
                                ...shipmentDetailsInput,
                                address: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                        type="text"
                        className="form-input"
                        value={shipmentDetailsInput.city}
                        onChange={(e) =>
                            setShipmentDetailsInput({
                                ...shipmentDetailsInput,
                                city: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                        type="text"
                        className="form-input"
                        value={shipmentDetailsInput.phone}
                        onChange={(e) =>
                            setShipmentDetailsInput({
                                ...shipmentDetailsInput,
                                phone: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Zip Code</label>
                    <input
                        type="text"
                        className="form-input"
                        value={shipmentDetailsInput.zipCode}
                        onChange={(e) =>
                            setShipmentDetailsInput({
                                ...shipmentDetailsInput,
                                zipCode: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <button type="submit" className="form-button">
                    Submit Billing Info
                </button>
            </form>
        </div>
        </div>
    );
};

export default BillingForm;