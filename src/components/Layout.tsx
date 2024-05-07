import Navigation from './Navigaton';

import '../styles/index.scss';
import SchemeToggle from './SchemeToggle';
import { Outlet } from 'react-router-dom';

import { useEffect, useState } from 'react';

function Layout() {
  const [darkmodeState, setDarkmodeState] = useState(false);

  useEffect(() => {
    // Update dark mode state based on local storage
    if (localStorage.getItem("darkmode")) {
      setDarkmodeState(true);
    }
  }, []);

  useEffect(() => {
    // Update local storage based on dark mode state
    if (darkmodeState) {
      localStorage.setItem("darkmode", "true");
    } else {
      localStorage.removeItem("darkmode");
    }
  }, [darkmodeState]);

  // Effect to sync state changes with local storage
  useEffect(() => {
    // Update local storage based on dark mode state

  }, [darkmodeState]); // Run this effect whenever darkmodeState changes

  const toggleDarkmode = () => {
    setDarkmodeState(!darkmodeState);
  }

  return (
    <>
      <div className={"main " + (darkmodeState ? "dark-mode" : "")}>
        <Navigation></Navigation>
        <main>
          <Outlet />
        </main>
        <SchemeToggle onClick={toggleDarkmode} />
      </div>
    </>
  );
}

export default Layout;