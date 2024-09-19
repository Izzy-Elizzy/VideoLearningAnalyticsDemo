# Video Analytics React App
This React application provides a video player with advanced analytics tracking capabilities. It allows users to watch a video while the app tracks viewing patterns, section views, and generates real-time analytics.

## Features

Video playback with standard controls
Section-based view tracking
Real-time chart of section views
Event logging for play, pause, seek, and end actions
Responsive design

## Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js and npm installed
Basic knowledge of React and JavaScript

## Installation

Clone the repository:
git clone https://github.com/yourusername/video-analytics-react-app.git

Navigate to the project directory:
cd video-analytics-react-app

Install the dependencies:
npm install


## Usage

Start the development server:
npm start

Open your browser and visit http://localhost:3000
Use the video player controls to play, pause, and seek through the video. The app will automatically track your viewing patterns.

## Configuration
You can adjust the following constants in the App.js file to customize the tracking behavior:

SECTION_DURATION: The duration of each section in seconds (default: 10)
VIEW_THRESHOLD: The percentage of a section that must be watched to count as a view (default: 0.5, or 50%)

## Components
Video Player
The app uses a standard HTML5 video player with custom event listeners for tracking user interactions.
Analytics Chart
A line chart implemented using recharts displays the number of views for each video section.
Section Views
A list of all sections and their view counts is displayed below the chart.
Event Logging
The most recent event (play, pause, seek, or end) is displayed at the bottom of the page.

## Data Tracking
The app tracks the following data:

Section views: Counted when a user watches at least 50% of a 10-second section
Play, pause, seek, and end events
Watch time for each section

## Contributing
Contributions to this project are welcome. Please follow these steps:

## Fork the repository
Create a new branch: git checkout -b feature-branch-name
Make your changes and commit them: git commit -m 'Add some feature'
Push to the original branch: git push origin feature-branch-name
Create the pull request

## License
This project is licensed under the MIT License.