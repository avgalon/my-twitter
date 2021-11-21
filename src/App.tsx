import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Chat from "./pages/chat";
import Join from "./pages/join";

function App() {
  const [siteLoaded, setSiteLoaded] = useState(false)

  useEffect(() => {
    setSiteLoaded(true);
  }, [setSiteLoaded]);

  return (
      <div className={`App${siteLoaded ? ' site_loaded' : ''}`}>
        <BrowserRouter>
          <Routes>
            <Route path="/chat/:name/:room" element={<Chat/>}>
            </Route>
            <Route path="/" element={<Join/>}>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
