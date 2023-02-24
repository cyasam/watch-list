import { Box, CircularProgress, Grid } from '@mui/material';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import CardItem from '~/components/CardItem';
import InfiniteScroller from '~/components/InfiniteScroller';
import { getMovies, movieActions } from '~/data/movies.server';

export default function TopRated() {
  const topRatedMovies: any = useLoaderData();
  const fetcher = useFetcher();
  const [movies, setMovies] = useState(topRatedMovies?.results);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return;
    }

    setMovies((prevMovies: any) => [...prevMovies, ...fetcher.data.results]);
  }, [fetcher.data, fetcher.state]);

  const initialPage = topRatedMovies.page;

  return (
    <Box position="relative">
      <InfiniteScroller
        loading={fetcher.state === 'loading'}
        loadNext={() => {
          const page = fetcher.data ? fetcher.data.page + 1 : initialPage + 1;
          const query = `/top-rated?page=${page}`;
          fetcher.load(query);
        }}
      >
        <Grid container spacing={2}>
          {movies.map((movie: any) => {
            return (
              <Grid key={movie.id} item xs={3}>
                <CardItem item={movie} />
              </Grid>
            );
          })}
        </Grid>
      </InfiniteScroller>
      <Box
        display="flex"
        position="absolute"
        bottom="0"
        width="100%"
        justifyContent="center"
        my={4}
      >
        <Box
          bgcolor="rgba(0, 0, 0, 0.5)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={1.5}
          borderRadius={2}
        >
          <CircularProgress />
        </Box>
      </Box>
    </Box>
  );
}

export async function loader({ request }: LoaderArgs) {
  const searchParams: any = new URL(request.url).searchParams;

  const page = searchParams.get('page') ?? '1';
  return getMovies({ page, type: 'top_rated' });
}

export async function action({ request }: ActionArgs) {
  try {
    return movieActions(request);
  } catch (error: any) {
    return { error: error.message, ok: false };
  }
}

export function ErrorBoundary({ error }: any) {
  return <p>{error.message}</p>;
}
