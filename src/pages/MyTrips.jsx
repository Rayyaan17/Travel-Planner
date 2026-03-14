import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './MyTrips.css'

const MyTrips = () => {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTrips()
    }
  }, [user])

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTrips(data || [])
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'planned':
        return 'status-planned'
      case 'ongoing':
        return 'status-ongoing'
      case 'completed':
        return 'status-completed'
      default:
        return 'status-planned'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="my-trips-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>My Trips</h1>
            <p>Manage and view all your planned adventures</p>
          </div>
          <Link to="/create-trip">
            <button className="btn btn-primary">Create New Trip</button>
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">✈️</div>
            <h2>No trips yet</h2>
            <p>Start planning your first adventure today!</p>
            <Link to="/create-trip">
              <button className="btn btn-primary">Create Your First Trip</button>
            </Link>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => (
              <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card card">
                <div className="trip-header">
                  <h3>{trip.title}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(trip.status)}`}>
                    {trip.status}
                  </span>
                </div>
                {trip.description && (
                  <p className="trip-description">{trip.description}</p>
                )}
                <div className="trip-dates">
                  <span className="date-icon">📅</span>
                  <span>
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips
