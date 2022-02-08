import { useEffect, useState } from 'react';
import { Bookmark, BookmarkFolder, BookmarkUrl } from 'type';
import { decryptData, getPasswordHash } from 'utils';
import './App.css';

export default function App() {
  const [syncId, setSyncId] = useState('');
  const [password, setPassword] = useState('');
  const [bookmarkItems, setBookmarkItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  async function load(syncId: string, passwordHash: string) {
    setLoading(true);
    try {
      const { bookmarks } = await (
        await fetch(`https://api.xbrowsersync.org/bookmarks/${syncId}`)
      ).json();

      const data = await decryptData(bookmarks, passwordHash);
      const bookmarkItems: [{ children: Bookmark[] }] = JSON.parse(data);

      setBookmarkItems(bookmarkItems[0]?.children || []);
    } catch (e) {
      // do nothing
    }
    setLoading(false);
  }

  useEffect(() => {
    const syncId = localStorage.getItem('syncId');
    const passwordHash = localStorage.getItem('password');
    if (!syncId || !passwordHash) {
      return;
    }
    setSyncId(syncId);
    load(syncId, passwordHash);
  }, []);

  async function onSave() {
    const passwordHash = await getPasswordHash(password, syncId);
    localStorage.setItem('password', passwordHash);
    localStorage.setItem('syncId', syncId);
    load(syncId, passwordHash);
  }

  return (
    <div>
      <div>
        <span>syncId:</span>
        <input value={syncId} onChange={(e) => setSyncId(e.target.value)} />
      </div>
      <div>
        <span>password:</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button disabled={!syncId || !password || loading} onClick={onSave}>
        Save
      </button>
      {bookmarkItems && <BookmarkItems items={bookmarkItems} />}
    </div>
  );
}

function BookmarkItems({ items }: { items: Bookmark[] }) {
  return (
    <>
      {items.map((item) => {
        if ((item as BookmarkFolder).children) {
          return <Folder item={item as BookmarkFolder} />;
        } else {
          return (
            <div className="item">
              <Link {...(item as BookmarkUrl)} />
            </div>
          );
        }
      })}
    </>
  );
}

const Link = ({ url, title }: BookmarkUrl) => (
  <a href={url} target="_blank" rel="noreferrer">
    {title}
  </a>
);

const Folder = ({ item }: { item: BookmarkFolder }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="folder">
      <div onClick={() => setCollapsed(!collapsed)}>
        <span className="handler" data-collapsed={collapsed ? 'true' : 'false'} />
        <span>{item.title}</span>
      </div>
      {collapsed ? null : <BookmarkItems items={item.children} />}
    </div>
  );
};
