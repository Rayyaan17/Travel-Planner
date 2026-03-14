# Travel Planner

A comprehensive web application designed to help users plan their trips effectively. Users can create accounts, plan trips by adding destinations and activities, search for popular destinations, view detailed information, and leave reviews for places they've visited.

## Features

### User Registration and Authentication
- Secure user registration with email and password
- User login with session management
- Protected routes for authenticated users
- Automatic authentication state management

### Trip Creation and Management
- Create new trips with title, description, dates, and status
- Add multiple destinations to a trip
- Add activities with scheduled dates and times
- View all personal trips in one place
- Track trip status (planned, ongoing, completed)
- Mark activities as completed
- Delete trips

### Destination Information
- Browse a curated collection of destinations
- View detailed information about each destination
- See high-quality images from Pexels
- Popular destinations highlighted
- Destination details include location and description

### Search Functionality
- Search destinations by name, city, or country
- Real-time search filtering
- Responsive search interface

### Review and Rating System
- Leave reviews for destinations
- Rate destinations from 1 to 5 stars
- View average ratings
- See all reviews from other travelers
- One review per user per destination

## Technology Stack

- **Frontend Framework:** React with Vite
- **Routing:** React Router DOM
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Custom CSS with responsive design
- **Stock Photos:** Pexels

## Database Schema

### Tables

1. **destinations**
   - id, name, description, country, city, image_url, popular, created_at, updated_at

2. **trips**
   - id, user_id, title, description, start_date, end_date, status, created_at, updated_at

3. **trip_destinations**
   - id, trip_id, destination_id, order_num, notes, created_at

4. **activities**
   - id, trip_id, destination_id, title, description, scheduled_date, scheduled_time, completed, created_at

5. **reviews**
   - id, user_id, destination_id, rating, comment, created_at, updated_at

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The project includes a `.env` file with Supabase credentials. The database is already configured and populated with sample destinations.

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Usage Instructions

### Creating an Account
1. Click "Get Started" or "Register" in the navigation
2. Enter your email and password
3. Click "Create Account"
4. You'll be automatically signed in

### Browsing Destinations
1. Click "Destinations" in the navigation
2. Use the search box to filter destinations by name, city, or country
3. Click on any destination to view detailed information

### Creating a Trip
1. Sign in to your account
2. Click "Create Trip" in the navigation
3. Fill in the trip details:
   - Trip title and description
   - Start and end dates
   - Trip status
4. Select destinations to visit
5. Add activities with optional dates and times
6. Click "Create Trip"

### Managing Trips
1. Click "My Trips" to view all your trips
2. Click on a trip to view details
3. Check off activities as you complete them
4. Delete trips if needed

### Writing Reviews
1. Navigate to a destination's detail page
2. Click "Write a Review"
3. Select a star rating (1-5)
4. Write your review
5. Click "Submit Review"

## Features Implementation

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 968px
- Touch-friendly interface
- Collapsible mobile menu

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own trips and activities
- Reviews and destinations are publicly viewable
- Proper authentication checks on all protected routes

### User Experience
- Loading states for all async operations
- Error handling and user feedback
- Smooth transitions and hover effects
- Intuitive navigation
- Clear visual hierarchy

## Sample Data

The application comes pre-populated with 10 popular destinations:
- Eiffel Tower (Paris, France)
- Grand Canyon (Arizona, USA)
- Great Wall of China (Beijing, China)
- Santorini (Greece)
- Machu Picchu (Cusco, Peru)
- Tokyo Tower (Tokyo, Japan)
- Colosseum (Rome, Italy)
- Sydney Opera House (Sydney, Australia)
- Taj Mahal (Agra, India)
- Northern Lights (Reykjavik, Iceland)

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Destinations.jsx
│   │   ├── DestinationDetail.jsx
│   │   ├── MyTrips.jsx
│   │   ├── CreateTrip.jsx
│   │   ├── TripDetail.jsx
│   │   └── respective CSS files
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── supabaseClient.js
├── index.html
├── vite.config.js
└── package.json
```

## Future Enhancements

Potential features for future releases:
- Weather forecast integration for destinations
- Sharing itineraries with friends
- Accommodation booking integration
- Budget tracking for trips
- Map integration for destinations
- Export trip itinerary as PDF
- Social features (follow users, like reviews)
- Photo uploads for reviews
- Multi-language support

## License

This project is created for educational purposes.
