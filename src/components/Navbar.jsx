import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            Travel Planner
          </Link>

          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/destinations" className="nav-link" onClick={closeMobileMenu}>
              Destinations
            </Link>
            {user ? (
              <>
                <Link to="/my-trips" className="nav-link" onClick={closeMobileMenu}>
                  My Trips
                </Link>
                <Link to="/create-trip" className="nav-link" onClick={closeMobileMenu}>
                  Create Trip
                </Link>
                <button onClick={handleSignOut} className="btn btn-outline">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <button className="btn btn-primary">Get Started</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
