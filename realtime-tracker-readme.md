# Realtime Tracker

Realtime Tracker is a web application that allows users to track their location and view the locations of other users in real-time. It uses Leaflet for mapping, Socket.IO for real-time communication, and includes features such as distance measurement, fullscreen mode, and user search.

## Features

- Real-time location tracking
- Interactive map with OpenStreetMap tiles
- Custom user markers with pulsing effect
- Distance measurement tool
- Fullscreen mode
- User search functionality
- Responsive design

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [Leaflet](https://leafletjs.com/) for mapping
- [Socket.IO](https://socket.io/) for real-time communication
- [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw) for drawing and measurement tools
- [Leaflet-search](https://github.com/stefanocudini/leaflet-search) for search functionality

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your local machine
- Basic knowledge of JavaScript and Node.js

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/realtime-tracker.git
   cd realtime-tracker
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=3000
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your web browser and navigate to `http://localhost:3000`

## Usage

1. Allow the application to access your location when prompted.
2. Your location will be displayed on the map with a pulsing blue marker.
3. Other connected users will appear as markers on the map.
4. Use the search tool (magnifying glass icon) to find specific users by typing "User [ID]".
5. Use the drawing tools to measure distances on the map.
6. Click the fullscreen button (🔎 icon) to toggle fullscreen mode.
7. Use the "Center Map" button to refocus the map on your location.

## Contributing

Contributions to the Realtime Tracker project are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## License

This project uses the following license: [MIT License](https://opensource.org/licenses/MIT).

## Contact

If you want to contact me, you can reach me at <your_email@example.com>.

## Acknowledgements

- [Leaflet](https://leafletjs.com/)
- [Socket.IO](https://socket.io/)
- [OpenStreetMap](https://www.openstreetmap.org/)
