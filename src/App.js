import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import Order from './pages/Order';
import Rent from './pages/Rent';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PortfolioAdmin from './pages/admin/PortfolioAdmin';
import FeaturesAdmin from './pages/admin/FeaturesAdmin';
import ShowcaseAdmin from './pages/admin/ShowcaseAdmin';
import TeamAdmin from './pages/admin/TeamAdmin';
import ContactAdmin from './pages/admin/ContactAdmin';
import './App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="portfolio" element={<PortfolioAdmin />} />
                  <Route path="features" element={<FeaturesAdmin />} />
                  <Route path="showcase" element={<ShowcaseAdmin />} />
                  <Route path="team" element={<TeamAdmin />} />
                  <Route path="contact" element={<ContactAdmin />} />
                </Route>

                {/* Public Routes */}
                <Route
                  path="/*"
                  element={
                    <>
                      <Header />
                      <main className="main-content">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/portfolio" element={<Portfolio />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          {/* Protected Routes - Require Login */}
                          <Route
                            path="/order"
                            element={
                              <ProtectedRoute>
                                <Order />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/rent"
                            element={
                              <ProtectedRoute>
                                <Rent />
                              </ProtectedRoute>
                            }
                          />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
