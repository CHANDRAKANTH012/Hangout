import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage.tsx";
import Hangouts from "./pages/Hangouts.tsx";
import Navbar from "./components/UI/Navbar.tsx";
import Footer from "./components/UI/Footer.tsx";
import Preloader from "./components/UI/Preloader.tsx";
import CursorOrb from "./components/UI/CursorOrb.tsx";
import CreateHangoutPage from "./components/CreateHangout/CreateHangoutPage.tsx";
import NotificationsPage from "./components/Notifications/NotificationsPage.tsx";
import HangoutRoom from "./pages/HangoutRoom.tsx";
import MapPage from "./pages/MapPage.tsx";

// https://www.meetup.com/

const App = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      {/* Global mouse-following sphere — renders above everything, hidden on touch */}
      <CursorOrb />

      {/* Preloader renders above everything — max 3s, then slides up and unmounts */}
      <Preloader onComplete={() => setPreloaderDone(true)} duration={2000} />

      {/* Main app fades in once preloader is done */}
      <div
        style={{
          opacity: preloaderDone ? 1 : 0,
          transition: "opacity 0.5s ease",
          visibility: preloaderDone ? "visible" : "hidden",
        }}
      >
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            {/* <Route path="/map" element={<MapPage />} /> */}
            <Route path="/hangouts" element={<Hangouts />} />
            <Route path="/create" element={<CreateHangoutPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/hangout/:id" element={<HangoutRoom />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </>
  );
};

export default App;
