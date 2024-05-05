import Navigation from './Navigaton';

import '../styles/index.scss';
import SchemeToggle from './SchemeToggle';
import { Outlet } from 'react-router-dom';

import { useState } from 'react';
import Loading from './Loading';

function Layout() {
  const [darkmodeState, setDarkmodeState] = useState(false);

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