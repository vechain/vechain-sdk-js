import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Hash from './Hash';

function App() {
  return (
    <Router>
      <div>
        <div>
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h2>Welcome to the SDK Vite Integration!</h2>
        <div className="card">
          <p>
            <b>@vechain/sdk-core</b> integration example:{' '}
            <Link
              className="text-blue-500 hover:underline"
              to="/hash" // Change from href to to for React Router
            >
              Hash
            </Link>
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
      
      {/* Define Routes */}
      <Routes>
        <Route path="/hash" element={<Hash />} />
      </Routes>
    </Router>
  );
}

export default App;
