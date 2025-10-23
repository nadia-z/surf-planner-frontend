# Surf planner

A React-based frontend for managing surf lessons, guest lists, and analytics.

## Features

- **Surf Plan View**: Plan and organize surf lessons
- **Weekly Group Planner**: Manage weekly surf group schedules
- **Guest Diet List**: View and export guest dietary requirements
- **Week Slot Planner**: Schedule weekly time slots
- **Analytics Dashboard**: View comprehensive statistics and charts including:
  - Age group distribution (pie chart)
  - Skill level distribution (bar chart)
  - Monthly overview with guest counts and lessons
  - Surf lesson statistics
  - Date range filtering
  - Year-based monthly trends

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Key Dependencies

- **React 19**: UI framework
- **React Bootstrap 5**: UI components
- **Chart.js 4**: Chart rendering engine
- **react-chartjs-2**: React wrapper for Chart.js
- **axios**: HTTP client for API requests
- **react-dnd**: Drag and drop functionality
- **xlsx**: Excel export functionality

## Backend Integration

This frontend connects to the SurfPlanner backend API. Ensure the backend is running at `http://localhost:8000` or update the `REACT_APP_API_BASE_URL` environment variable.

The analytics dashboard requires the following backend endpoints:
- `GET /analytics/age-groups?start_date={date}&end_date={date}`
- `GET /analytics/surf-lessons?start_date={date}&end_date={date}`
- `GET /analytics/skill-levels?start_date={date}&end_date={date}`
- `GET /analytics/monthly/{year}`
