import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { decryptData, getPasswordHash } from 'utils';
import { Bookmark } from 'type';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function load() {
      const syncId = 'xxx';
      const { bookmarks } = await (
        await fetch(`https://api.xbrowsersync.org/bookmarks/${syncId}`)
      ).json();
      console.log(bookmarks);
      const passwordHash = await getPasswordHash('xxx', syncId);
      const data = await decryptData(bookmarks, passwordHash);
      const bookmarkItems: Bookmark[] = JSON.parse(data);

      console.log(bookmarkItems);
    }
    load();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
