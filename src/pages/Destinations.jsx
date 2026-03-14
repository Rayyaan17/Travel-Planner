import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Destinations.css'

const Destinations = () => {
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDestinations()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDestinations(destinations)
    } else {
      const filtered = destinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredDestinations(filtered)
    }
  }, [searchTerm, destinations])

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name')

      if (error) throw error
      setDestinations(data || [])
      setFilteredDestinations(data || [])
    } catch (error) {
      console.error('Error fetching destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="destinations-page">
      <div className="container">
        <div className="page-header">
          <h1>Explore Destinations</h1>
          <p>Discover your next adventure from our curated collection of amazing places</p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search destinations by name, city, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="no-results">
            <p>No destinations found matching your search.</p>
          </div>
        ) : (
          <div className="destinations-grid">
            {filteredDestinations.map((destination) => (
              <Link
                to={`/destinations/${destination.id}`}
                key={destination.id}
                className="destination-card card"
              >
                <div
                  className="destination-image"
                  style={{ backgroundImage: `url(${destination.image_url})` }}
                >
                  {destination.popular && (
                    <span className="popular-badge">Popular</span>
                  )}
                </div>
                <div className="destination-info">
                  <h3>{destination.name}</h3>
                  <p className="destination-location">
                    {destination.city}, {destination.country}
                  </p>
                  <p className="destination-description">
                    {destination.description.substring(0, 100)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Destinations
