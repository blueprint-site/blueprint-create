import Navigation from './Navigaton';

import '../styles/index.scss';
import SchemeToggle from './SchemeToggle';
import { Outlet } from 'react-router-dom';

import { useEffect, useState } from 'react';

function Layout() {
  const [darkmodeState, setDarkmodeState] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("darkmode")) {
      setDarkmodeState(true);
    }
  }, []);

  useEffect(() => {
    if (darkmodeState) {
      localStorage.setItem("darkmode", "true");
    } else {
      localStorage.removeItem("darkmode");
    }
  }, [darkmodeState]);

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