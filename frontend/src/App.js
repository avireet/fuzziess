import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Header from './Components/header';
import Home from './Pages/home';
import About from './Pages/about';
import SignupLogin from './Pages/SignupLogin';
import CategoryList from './Pages/CategoryList';
import Cart from './Pages/Cart';
import BillingForm from './Pages/BillingForm';
import BillingPage from './Components/BillingPage';
import Product from './Pages/Product';
import AdminDashboard from './Pages/AdminDashboard';
import ProfilePage from './Components/ProfilePage';
import './App.css';

// Layout with Header
const MainLayout = ({ isAuthenticated, isAdmin, handleLogout }) => (
  <>
    <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />
    <main>
      <Outlet />
    </main>
  </>
);

// Layout without Header (for login/signup)
const AuthLayout = () => (
  <main>
    <Outlet />
  </main>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setIsAuthenticated(true);
      setIsAdmin(storedUser.isAdmin || false);
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setIsAdmin(user.isAdmin || false);
    localStorage.setItem('user', JSON.stringify(user));
    
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.clear();
  };

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  return (
    <Router>
      {feedbackMessage && <div className="feedback-message">{feedbackMessage}</div>}

      <Routes>
        {/* Auth routes (NO navbar) */}
        <Route element={<AuthLayout />}> 
          <Route path="/login" element={<SignupLogin onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupLogin onLogin={handleLogin} />} />
        </Route>

        {/* Main routes (WITH navbar) */}
        <Route element={<MainLayout isAuthenticated={isAuthenticated} isAdmin={isAdmin} handleLogout={handleLogout} />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/:categoryName" element={<Product />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/cart" element={ isAuthenticated && !isAdmin ? (<Cart />) : (<Navigate to="/" replace />)}/>
          <Route path="/billing" element={ isAuthenticated && !isAdmin ? (<BillingPage />)  : (<Navigate to="/" replace />)} />
          <Route path="/form" element={<BillingForm />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin restricted */}
          <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
