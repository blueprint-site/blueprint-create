import Navigation from './components/Navigaton';

import './styles/index.scss';
import SchemeToggle from './components/SchemeToggle';
import AwardsBanner from './components/AwardsBanner';

function App() {
  return (
    <>
      <Navigation></Navigation>
      <main>
        <AwardsBanner />
      </main>
      <SchemeToggle />
    </>
  );
}

export default App;