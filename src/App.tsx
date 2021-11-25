import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Twits from "./pages/twits";
import Join from "./pages/join";
import Feeds from "./pages/feeds";

function App() {
  const [siteLoaded, setSiteLoaded] = useState(false)

  useEffect(() => {
    setSiteLoaded(true);
  }, [setSiteLoaded]);

  return (
      <div className={`App${siteLoaded ? ' site_loaded' : ''}`}>
        <BrowserRouter>
          <Routes>
            <Route path="/chat/:name/:room" element={<Twits/>}>
            </Route>
            <Route path="/" element={<Join/>}>
            </Route>
           {/* <Route path="/feeds/:filter" element={<Feeds/>}>
            </Route>
            <Route path="/feeds/:logged-in-user" element={<Feeds/>}>
            </Route>*/}
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
