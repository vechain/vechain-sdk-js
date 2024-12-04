import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Hash from './components/Hash';
import TransferLogs from './components/TransferLogs';
import GetLastBlock from './components/GetLastBlock';

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
            <Link data-testid="hash-link"
              className="text-blue-500 hover:underline"
              to="/hash" // Change from href to to for React Router
            >
              Hash
            </Link>
          </p>
          <p>
            <b>@vechain/sdk-network</b> integration example:{' '}
            <Link data-testid="transfers-link"
              className="text-blue-500 hover:underline"
              to='/transfer-logs'
            >
              Transfer logs
            </Link>
          </p>
          <p>
            <b>@vechain/sdk-network</b> integration example:{' '}
            <Link data-testid="latest-block-link"
              className="text-blue-500 hover:underline"
              to='/get-last-block'
            >
              Get last block
            </Link>
          </p>
        </div>
      </div>

      {/* Define Routes */}
      <Routes>
        <Route path="/hash" element={<Hash />} />
        <Route path="/transfer-logs" element={<TransferLogs />} />
        <Route path="/get-last-block" element={<GetLastBlock />} />
      </Routes>
    </Router>
  );
}

export default App;
