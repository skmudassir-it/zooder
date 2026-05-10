import { create } from "zustand";

interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  _count: { likes: number; comments: number };
  liked?: boolean;
}

interface FeedState {
  posts: Post[];
  cursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  setPosts: (posts: Post[], cursor: string | null) => void;
  appendPosts: (posts: Post[], cursor: string | null) => void;
  addPost: (post: Post) => void;
  removePost: (postId: string) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  toggleLike: (postId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  cursor: null,
  hasMore: true,
  isLoading: false,
  setPosts: (posts, cursor) => set({ posts, cursor, hasMore: cursor !== null }),
  appendPosts: (newPosts, cursor) =>
    set((state) => ({
      posts: [...state.posts, ...newPosts],
      cursor,
      hasMore: cursor !== null,
    })),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  removePost: (postId) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) })),
  updatePost: (postId, updates) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === postId ? { ...p, ...updates } : p)),
    })),
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id !== postId) return p;
        const liked = !p.liked;
        return { ...p, liked, _count: { ...p._count, likes: p._count.likes + (liked ? 1 : -1) } };
      }),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
