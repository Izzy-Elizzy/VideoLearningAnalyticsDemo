import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import exampleVideo from "./example_video.mp4";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const playerRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [sectionViews, setSectionViews] = useState({});
  const [mostRecentEvent, setMostRecentEvent] = useState("Nothing yet!")
  const currentSection = useRef(null);
  const sectionWatchTime = useRef({});
  const sectionInterval = useRef(null);

  const SECTION_DURATION = 10; // Each section is 10 seconds long
  const VIEW_THRESHOLD = 0.5; // 50% of the section must be watched to count as a view

  const logEvent = (eventType, timestamp, additionalData = {}) => {
    setMostRecentEvent(`Event: ${eventType}, Timestamp: ${timestamp}`)
    console.log(
      `Event: ${eventType}, Timestamp: ${timestamp}, Data:`,
      additionalData
    );
    // Send this data to your server using AJAX or Fetch API
  };

  const updateSectionViews = (section) => {
    if (sectionWatchTime.current[section] >= SECTION_DURATION * VIEW_THRESHOLD) {
      setSectionViews((prev) => ({
        ...prev,
        [section]: (prev[section] || 0) + 1,
      }));
      // Reset watch time for this section after counting a view
      sectionWatchTime.current[section] = 0;
      logEvent("section_view", playerRef.current.currentTime, { section: section });
    }
  };

  const trackCurrentSection = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      const newSection = Math.floor(currentTime / SECTION_DURATION);

      if (newSection !== currentSection.current) {
        // Check if we should count a view for the previous section
        if (currentSection.current !== null) {
          updateSectionViews(currentSection.current);
        }
        currentSection.current = newSection;
        // Initialize watch time for new section if not exists
        if (!sectionWatchTime.current[newSection]) {
          sectionWatchTime.current[newSection] = 0;
        }
      }
      
      // Increment watch time for current section
      sectionWatchTime.current[newSection] = (sectionWatchTime.current[newSection] || 0) + 1;
      
      // Check if we should count a view for the current section
      updateSectionViews(newSection);
    }
  };

  useEffect(() => {
    const myVideoElement = document.getElementById("my-video");
    if (myVideoElement) {
      playerRef.current = myVideoElement;

      const eventHandlers = {
        loadedmetadata: () => {
          setVideoDuration(myVideoElement.duration);
          const totalSections = Math.ceil(
            myVideoElement.duration / SECTION_DURATION
          );
          const initialSectionViews = {};
          for (let i = 0; i < totalSections; i++) {
            initialSectionViews[i] = 0;
          }
          setSectionViews(initialSectionViews);
        },
        play: () => {
          logEvent("play", myVideoElement.currentTime);
          sectionInterval.current = setInterval(trackCurrentSection, 1000);
        },
        pause: () => {
          logEvent("pause", myVideoElement.currentTime);
          if (sectionInterval.current) {
            clearInterval(sectionInterval.current);
          }
          // Check if we should count a view when pausing
          if (currentSection.current !== null) {
            updateSectionViews(currentSection.current);
          }
        },
        seeked: () => {
          logEvent("seeked", myVideoElement.currentTime);
          // Reset watch time for new section after seeking
          const newSection = Math.floor(myVideoElement.currentTime / SECTION_DURATION);
          sectionWatchTime.current[newSection] = 0;
          trackCurrentSection();
        },
        ended: () => {
          logEvent("ended", myVideoElement.currentTime);
          if (sectionInterval.current) {
            clearInterval(sectionInterval.current);
          }
          // Check if we should count a view for the last section
          if (currentSection.current !== null) {
            updateSectionViews(currentSection.current);
          }
        },
      };

      // Attach event listeners
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        myVideoElement.addEventListener(event, handler);
      });

      // Cleanup function
      return () => {
        Object.entries(eventHandlers).forEach(([event, handler]) => {
          myVideoElement.removeEventListener(event, handler);
        });
        if (sectionInterval.current) {
          clearInterval(sectionInterval.current);
        }
      };
    }
  }, []);

  const chartData = Object.entries(sectionViews).map(([section, views]) => ({
    name: `${section * SECTION_DURATION}-${Math.min(
      (parseInt(section) + 1) * SECTION_DURATION,
      videoDuration
    )}s`,
    views: views,
  }));

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <video id="my-video" className="video" controls>
            <source src={exampleVideo} type="video/mp4" />
          </video>
          <div>
          </div>
        </div>

        <div className="plot">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="views">
          <h2>Section Views (50% watched to count)</h2>
          {Object.entries(sectionViews).map(([section, views]) => (
            <p key={section}>
              Section {section} ({section * SECTION_DURATION}-
              {Math.min(
                (parseInt(section) + 1) * SECTION_DURATION,
                videoDuration
              )}{" "}
              seconds): {views} views
            </p>
          ))}
        </div>

        <div className="events">
          <h2>Most Recent Event Triggered</h2>
          <p>{mostRecentEvent}</p>
        </div>

      </header>
    </div>
  );
}

export default App;