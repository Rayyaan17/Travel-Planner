import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Home.css'

const Home = () => {
  const [popularDestinations, setPopularDestinations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularDestinations()
  }, [])

  const fetchPopularDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('popular', true)
        .limit(6)

      if (error) throw error
      setPopularDestinations(data || [])
    } catch (error) {
      console.error('Error fetching destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Plan Your Dream Journey</h1>
            <p className="hero-subtitle">
              Discover amazing destinations, create detailed itineraries, and make unforgettable memories
            </p>
            <div className="hero-actions">
              <Link to="/destinations">
                <button className="btn btn-primary">Explore Destinations</button>
              </Link>
              <Link to="/create-trip">
                <button className="btn btn-outline">Start Planning</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Travel Planner?</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">📍</div>
              <h3>Discover Destinations</h3>
              <p>Browse through curated destinations from around the world with detailed information and reviews</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🗓️</div>
              <h3>Plan Your Trips</h3>
              <p>Create comprehensive trip itineraries with dates, activities, and accommodations all in one place</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">⭐</div>
              <h3>Share Reviews</h3>
              <p>Read and write reviews to help fellow travelers make informed decisions about their destinations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="popular-destinations">
        <div className="container">
          <h2 className="section-title">Popular Destinations</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="destinations-grid">
              {popularDestinations.map((destination) => (
                <Link
                  to={`/destinations/${destination.id}`}
                  key={destination.id}
                  className="destination-card card"
                >
                  <div
                    className="destination-image"
                    style={{ backgroundImage: `url(${destination.image_url})` }}
                  ></div>
                  <div className="destination-info">
                    <h3>{destination.name}</h3>
                    <p className="destination-location">
                      {destination.city}, {destination.country}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/destinations">
              <button className="btn btn-primary">View All Destinations</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
