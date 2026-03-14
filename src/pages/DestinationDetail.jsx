import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './DestinationDetail.css'

const DestinationDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [destination, setDestination] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDestination()
    fetchReviews()
  }, [id])

  const fetchDestination = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      setDestination(data)
    } catch (error) {
      console.error('Error fetching destination:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('destination_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Please sign in to leave a review')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            destination_id: id,
            rating,
            comment,
          },
        ])

      if (insertError) throw insertError

      setShowReviewForm(false)
      setComment('')
      setRating(5)
      fetchReviews()
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Destination not found</h2>
        <Link to="/destinations">
          <button className="btn btn-primary">Back to Destinations</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="destination-detail">
      <div
        className="destination-hero"
        style={{ backgroundImage: `url(${destination.image_url})` }}
      >
        <div className="destination-hero-overlay">
          <div className="container">
            <h1>{destination.name}</h1>
            <p className="location">
              {destination.city}, {destination.country}
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="destination-content">
          <div className="destination-main">
            <section className="card">
              <h2>About This Destination</h2>
              <p>{destination.description}</p>
            </section>

            <section className="reviews-section">
              <div className="reviews-header">
                <div>
                  <h2>Reviews & Ratings</h2>
                  {reviews.length > 0 && (
                    <div className="average-rating">
                      <span className="rating-number">{calculateAverageRating()}</span>
                      <span className="stars">{'⭐'.repeat(Math.round(calculateAverageRating()))}</span>
                      <span className="review-count">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
                {user && !showReviewForm && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="review-form card">
                  <h3>Write Your Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="form-group">
                      <label>Rating</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${star <= rating ? 'active' : ''}`}
                            onClick={() => setRating(star)}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="comment">Your Review</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows="4"
                        required
                      />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to review this destination!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="review-card card">
                      <div className="review-header">
                        <div className="review-rating">
                          {'⭐'.repeat(review.rating)}
                        </div>
                        <div className="review-date">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="destination-sidebar">
            <div className="card">
              <h3>Plan Your Visit</h3>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Ready to explore {destination.name}?
              </p>
              <Link to="/create-trip">
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Add to Trip
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationDetail
