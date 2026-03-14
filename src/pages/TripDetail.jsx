import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './TripDetail.css'

const TripDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTripDetails()
  }, [id])

  const fetchTripDetails = async () => {
    try {
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (tripError) throw tripError

      if (!tripData || tripData.user_id !== user.id) {
        navigate('/my-trips')
        return
      }

      setTrip(tripData)

      const { data: tripDestData, error: destError } = await supabase
        .from('trip_destinations')
        .select(`
          *,
          destinations (*)
        `)
        .eq('trip_id', id)
        .order('order_num')

      if (destError) throw destError
      setDestinations(tripDestData || [])

      const { data: activitiesData, error: actError } = await supabase
        .from('activities')
        .select('*')
        .eq('trip_id', id)
        .order('scheduled_date', { ascending: true })

      if (actError) throw actError
      setActivities(activitiesData || [])
    } catch (error) {
      console.error('Error fetching trip details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActivity = async (activityId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ completed: !currentStatus })
        .eq('id', activityId)

      if (error) throw error

      setActivities(
        activities.map((activity) =>
          activity.id === activityId
            ? { ...activity, completed: !currentStatus }
            : activity
        )
      )
    } catch (error) {
      console.error('Error updating activity:', error)
    }
  }

  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/my-trips')
    } catch (error) {
      console.error('Error deleting trip:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Trip not found</h2>
      </div>
    )
  }

  return (
    <div className="trip-detail-page">
      <div className="container">
        <div className="trip-header-section">
          <div>
            <h1>{trip.title}</h1>
            <div className="trip-meta">
              <span className="trip-dates">
                📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </span>
              <span className={`status-badge status-${trip.status}`}>
                {trip.status}
              </span>
            </div>
            {trip.description && (
              <p className="trip-description">{trip.description}</p>
            )}
          </div>
          <button
            className="btn-delete"
            onClick={handleDeleteTrip}
          >
            Delete Trip
          </button>
        </div>

        <div className="trip-content">
          <div className="trip-main">
            {destinations.length > 0 && (
              <section className="card">
                <h2>Destinations</h2>
                <div className="destinations-list">
                  {destinations.map((tripDest) => (
                    <div key={tripDest.id} className="destination-item">
                      <div
                        className="destination-thumbnail"
                        style={{
                          backgroundImage: `url(${tripDest.destinations.image_url})`,
                        }}
                      ></div>
                      <div className="destination-details">
                        <h3>{tripDest.destinations.name}</h3>
                        <p className="destination-location">
                          {tripDest.destinations.city}, {tripDest.destinations.country}
                        </p>
                        {tripDest.notes && (
                          <p className="destination-notes">{tripDest.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activities.length > 0 && (
              <section className="card">
                <h2>Activities</h2>
                <div className="activities-list">
                  {activities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <label className="activity-checkbox">
                        <input
                          type="checkbox"
                          checked={activity.completed}
                          onChange={() => handleToggleActivity(activity.id, activity.completed)}
                        />
                        <div className="activity-content">
                          <h4 className={activity.completed ? 'completed' : ''}>
                            {activity.title}
                          </h4>
                          {activity.description && (
                            <p className="activity-description">
                              {activity.description}
                            </p>
                          )}
                          {(activity.scheduled_date || activity.scheduled_time) && (
                            <p className="activity-schedule">
                              {activity.scheduled_date && formatDate(activity.scheduled_date)}
                              {activity.scheduled_time && ` at ${formatTime(activity.scheduled_time)}`}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {destinations.length === 0 && activities.length === 0 && (
              <div className="empty-state card">
                <p>No destinations or activities added yet.</p>
              </div>
            )}
          </div>

          <div className="trip-sidebar">
            <div className="card">
              <h3>Trip Summary</h3>
              <div className="summary-item">
                <span className="summary-label">Duration</span>
                <span className="summary-value">
                  {Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Destinations</span>
                <span className="summary-value">{destinations.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Activities</span>
                <span className="summary-value">
                  {activities.filter(a => a.completed).length} / {activities.length} completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDetail
