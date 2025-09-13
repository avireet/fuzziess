import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import { FaFileInvoiceDollar } from "react-icons/fa"; // Import the Billing icon
import '../App.css'; 

const Header = ({ isAuthenticated, isAdmin, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        alert('Logout successful');
        navigate('/');
    };

    return (
        <div className="header">
            <div className="logo">
                <img src="logo2.png" alt="Logo" />
            </div>
            <hr />
            <nav>
                <ul>
                    <div className='navdivwologo'>
                        <li><Link to="/">HOME</Link></li>

                        {/* Show WHO WE ARE link only if isAdmin is false */}
                        {!isAdmin && (
                            <li><Link to="/about">WHO WE ARE</Link></li>
                        )}

                        {/* Show admin dashboard link only if isAdmin is true */}
                        {isAdmin && (
                            <li>
                                <Link to="/admin" className="admin-link">
                                    ADMIN DASHBOARD
                                </Link>
                            </li>
                        )}
                    </div>

                    <div className='navdivwlogo'>
                        {/* Show CART tab only if isAdmin is false */}
                        {!isAdmin && isAuthenticated &&(
                            <li>
                                <Link to="/cart">
                                    <FaShoppingCart size={19} className='header-icons' aria-hidden="true" />
                                </Link>
                            </li>
                        )}

                        {/* Show BILLING tab with icon only if authenticated */}
                        {!isAdmin && isAuthenticated && (
                            <li>
                                <Link to="/billing" className="billing-link">
                                    <FaFileInvoiceDollar size={19} className='header-icons' aria-hidden="true" /> 
                                </Link>
                            </li>
                        )}

                        {isAuthenticated && (
                            <li>
                                <Link to="/profile">
                                    <FaUserAlt size={17} className='header-icons' aria-hidden="true" />
                                </Link>
                            </li>
                        )}
                        
                        <li>
                            {isAuthenticated ? (
                                <button onClick={handleLogoutClick} className="logout-button">
                                    <AiOutlineLogout size={23} className='header-icons' aria-hidden="true" />
                                </button>
                            ) : (
                                <Link to="/login">
                                    <FaUserAlt size={16} className='header-icons' aria-hidden="true" />
                                </Link>
                            )}
                        </li>
                    </div>
                </ul>
            </nav>
        </div>
    );
};

export default Header;
