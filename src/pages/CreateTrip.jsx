import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './CreateTrip.css'

const CreateTrip = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('planned')
  const [destinations, setDestinations] = useState([])
  const [selectedDestinations, setSelectedDestinations] = useState([])
  const [activities, setActivities] = useState([{ title: '', description: '', scheduled_date: '', scheduled_time: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, city, country')
        .order('name')

      if (error) throw error
      setDestinations(data || [])
    } catch (error) {
      console.error('Error fetching destinations:', error)
    }
  }

  const handleAddActivity = () => {
    setActivities([...activities, { title: '', description: '', scheduled_date: '', scheduled_time: '' }])
  }

  const handleRemoveActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index))
  }

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...activities]
    updatedActivities[index][field] = value
    setActivities(updatedActivities)
  }

  const handleDestinationToggle = (destinationId) => {
    if (selectedDestinations.includes(destinationId)) {
      setSelectedDestinations(selectedDestinations.filter((id) => id !== destinationId))
    } else {
      setSelectedDestinations([...selectedDestinations, destinationId])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (new Date(startDate) > new Date(endDate)) {
      setError('End date must be after start date')
      return
    }

    setLoading(true)

    try {
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            start_date: startDate,
            end_date: endDate,
            status,
          },
        ])
        .select()
        .single()

      if (tripError) throw tripError

      if (selectedDestinations.length > 0) {
        const tripDestinations = selectedDestinations.map((destId, index) => ({
          trip_id: tripData.id,
          destination_id: destId,
          order_num: index,
        }))

        const { error: destError } = await supabase
          .from('trip_destinations')
          .insert(tripDestinations)

        if (destError) throw destError
      }

      const validActivities = activities.filter((activity) => activity.title.trim() !== '')
      if (validActivities.length > 0) {
        const tripActivities = validActivities.map((activity) => ({
          trip_id: tripData.id,
          title: activity.title,
          description: activity.description,
          scheduled_date: activity.scheduled_date || null,
          scheduled_time: activity.scheduled_time || null,
        }))

        const { error: actError } = await supabase
          .from('activities')
          .insert(tripActivities)

        if (actError) throw actError
      }

      navigate(`/trips/${tripData.id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="create-trip-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Trip</h1>
          <p>Plan your next adventure with all the details</p>
        </div>

        <form onSubmit={handleSubmit} className="trip-form">
          <div className="form-section card">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="title">Trip Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Summer Europe Adventure"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your trip..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date *</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section card">
            <h2>Destinations</h2>
            <p className="section-description">Select destinations you want to visit</p>

            <div className="destinations-select">
              {destinations.map((destination) => (
                <label key={destination.id} className="destination-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDestinations.includes(destination.id)}
                    onChange={() => handleDestinationToggle(destination.id)}
                  />
                  <span>{destination.name} ({destination.city}, {destination.country})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section card">
            <div className="section-header">
              <h2>Activities</h2>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddActivity}
              >
                Add Activity
              </button>
            </div>

            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label htmlFor={`activity-title-${index}`}>Activity Title</label>
                    <input
                      id={`activity-title-${index}`}
                      type="text"
                      value={activity.title}
                      onChange={(e) => handleActivityChange(index, 'title', e.target.value)}
                      placeholder="e.g., Visit Eiffel Tower"
                    />
                  </div>
                  {activities.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveActivity(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor={`activity-description-${index}`}>Description</label>
                  <textarea
                    id={`activity-description-${index}`}
                    value={activity.description}
                    onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                    placeholder="Activity details..."
                    rows="2"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`activity-date-${index}`}>Date</label>
                    <input
                      id={`activity-date-${index}`}
                      type="date"
                      value={activity.scheduled_date}
                      onChange={(e) => handleActivityChange(index, 'scheduled_date', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`activity-time-${index}`}>Time</label>
                    <input
                      id={`activity-time-${index}`}
                      type="time"
                      value={activity.scheduled_time}
                      onChange={(e) => handleActivityChange(index, 'scheduled_time', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/my-trips')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTrip
