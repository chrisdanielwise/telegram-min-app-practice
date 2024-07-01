import React, { useState, useEffect, useCallback,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import axios from "axios"

function App() {
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const APP_URL = "http://localhost:8080"
  const windowRef = useRef(null);
  const [data, setData] = useState({
    version: '1.0',
    platform: 'Web',
    colorScheme: 'light',
    themeParams: { backgroundColor: '#fff', textColor: '#333' },
    isExpanded: false,
    viewportHeight: 600,
    viewportStableHeight: 600,
    isClosingConfirmationEnabled: false,
    backButton: { isVisible: true, text: 'Back' },
    mainButton: { text: 'Main', color: '#2481cc' },
    settingsButton: { isVisible: true },
    hapticFeedback: { enabled: false },
    cloudStorage: { enabled: false },
  });
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(false);
  const onSettingsClick = () => {
    setHapticFeedbackEnabled(!hapticFeedbackEnabled);
    webApp.showAlert(`Haptic feedback ${hapticFeedbackEnabled ? 'enabled' : 'disabled'}`);
  };
// console.log(data?.backButton?.isVisible,"isVisible")
  const onBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onMainClick = useCallback(() => {
    webApp.showAlert("Main button click");
  }, [webApp]);

  const handleBackButton = () => {
    data.isClosingConfirmationEnabled = true;
    console.log("Back button clicked!");
    // Perform any necessary actions here
  };

  useEffect(() => {
   // Fetch user info from backend
   axios.get(APP_URL + '/api/user-info')
   .then((response) => {
     const userInfo = response.data;
     console.log('Received user info:', userInfo);
     // Update state with fetched data
     // setData(userInfo);
   })
   .catch((error) => {
     console.error('Error fetching user info:', error);
     // Handle the error state or display a message to the user
   });

 data.hapticFeedback.enabled = hapticFeedbackEnabled;

  windowRef.current = window;
  // windowRef.current.addEventListener("popstate", handleBackButton); 

 const handleBeforeUnload = (event) => {
  console.log("Before unload")
   if (data.isClosingConfirmationEnabled) {
     event.preventDefault();
     event.returnValue = "";
     webApp.showAlert("Are you sure you want to close the app?");
   }
 };
 windowRef.current.addEventListener("beforeunload", handleBeforeUnload);
//  console.log(windowRef.current, handleBeforeUnload)

 // Initialize Telegram webApp
 webApp.ready((initData) => {
   setData(initData);
 });
 webApp.BackButton.onClick(onBackClick);
 webApp.MainButton.onClick(onMainClick);

 // Clean up event listeners
 return () => {
   webApp.BackButton.offClick(onBackClick);
   webApp.MainButton.offClick(onMainClick);
   windowRef.current.removeEventListener("beforeunload", handleBeforeUnload);
 };
}, [webApp, onBackClick, onMainClick, hapticFeedbackEnabled, data.isClosingConfirmationEnabled]);

  return (
    <div className="app-container">
      <h1>Telegram WebApp</h1>
      <div className="telegram-params">
        <h2>Init Data:</h2>
        {/* Display the fetched data */}
        <h2>Version:</h2>
        <p>{data.version}</p>
        <h2>Platform:</h2>
        <p>{data.platform}</p>
        <h2>Color Scheme:</h2>
        <p>{data.colorScheme}</p>
        <h2>Theme Params:</h2>
        <pre>{JSON.stringify(data.themeParams, null, 2)}</pre>
        <h2>Is Expanded:</h2>
        <p>{data.isExpanded}</p>
        <h2>Viewport Height:</h2>
        <p>{data.viewportHeight}</p>
        <h2>Viewport Stable Height:</h2>
        <p>{data.viewportStableHeight}</p>
        <h2>Is Closing Confirmation Enabled:</h2>
        <p>{data.isClosingConfirmationEnabled}</p>
      </div>
      <div className="buttons">
        <button
          className="back-button"
          style={{ visibility: data?.backButton?.isVisible ? 'visible' : 'hidden' }}
          onClick={onBackClick}
        >
          {data.backButton.text}
        </button>
        <button
          className="main-button"
          style={{ backgroundColor: data.mainButton.color }}
          onClick={onMainClick}
        >
          {data.mainButton.text}
        </button>
        <button
          className="settings-button"
          style={{ visibility: data.settingsButton.isVisible ? 'visible' : 'hidden' }}
          onClick={() => {
            // Handle settings button click
          }}
        >
          Settings
        </button>
        {/* <button
  className="back-button"
  onClick={handleBackButton}
>
  ← Back
</button> */}
      </div>
      <button
      className="haptic-feedback"
      onClick={onSettingsClick}
      >
    {hapticFeedbackEnabled ? 'Disable Haptic Feedback' : 'Enable Haptic Feedback'}
    </button>
      <div className="cloud-storage">
        <h2>Cloud Storage:</h2>
        <pre>{JSON.stringify(data.cloudStorage, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;