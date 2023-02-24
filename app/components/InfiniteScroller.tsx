import { useCallback, useEffect, useRef } from 'react';

const InfiniteScroller = (props: {
  children: any;
  loading: boolean;
  loadNext: () => void;
}) => {
  const { children, loading, loadNext } = props;
  const scrollListener = useRef(loadNext);

  useEffect(() => {
    scrollListener.current = loadNext;
  }, [loadNext]);

  const onScroll = useCallback(() => {
    const documentHeight = document.documentElement.scrollHeight;
    const scrollDifference = Math.floor(window.innerHeight + window.scrollY);
    const scrollNotEnded = documentHeight - 150 > scrollDifference;

    if (!scrollNotEnded && !loading) {
      scrollListener.current();
    }
  }, [loading]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      onScroll();
      window.addEventListener('scroll', onScroll);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  return <>{children}</>;
};

export default InfiniteScroller;
