interface BookmarkBase {
  id: string;
  title: string;
}

export interface BookmarkUrl extends BookmarkBase {
  url: string;
}

export interface BookmarkFolder extends BookmarkBase {
  children: Bookmark[];
}

export type Bookmark = BookmarkUrl | BookmarkFolder;

export function isBookmarkUrl(bookmark: Bookmark): bookmark is BookmarkUrl {
  return (bookmark as BookmarkUrl).url !== undefined;
}

export function isBookmarkFolder(bookmark: Bookmark): bookmark is BookmarkFolder {
  return (bookmark as BookmarkFolder).children !== undefined;
}
