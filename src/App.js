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
import HomeAdmin from './pages/admin/HomeAdmin';
import PortfolioAdmin from './pages/admin/PortfolioAdmin';
import AboutAdmin from './pages/admin/AboutAdmin';
import RentAdmin from './pages/admin/RentAdmin';
import ContactAdmin from './pages/admin/ContactAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import './App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<HomeAdmin />} />
                  <Route path="portfolio" element={<PortfolioAdmin />} />
                  <Route path="about" element={<AboutAdmin />} />
                  <Route path="rent" element={<RentAdmin />} />
                  <Route path="contact" element={<ContactAdmin />} />
                  <Route path="settings" element={<SettingsAdmin />} />
                </Route>

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
