import { Box, CircularProgress, Grid } from '@mui/material';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import CardItem from '~/components/CardItem';
import InfiniteScroller from '~/components/InfiniteScroller';
import { getUserSession } from '~/data/auth.server';
import {
  addToWatchList,
  deleteWatchListItem,
  getPopularMovies,
} from '~/data/movies.server';

export default function Index() {
  const popularMovies: any = useLoaderData();
  const fetcher = useFetcher();
  const [movies, setMovies] = useState(popularMovies?.results);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return;
    }

    setMovies((prevMovies: any) => [...prevMovies, ...fetcher.data.results]);
  }, [fetcher.data, fetcher.state]);

  const initialPage = popularMovies.page;

  return (
    <Box position="relative">
      <InfiniteScroller
        loading={fetcher.state === 'loading'}
        loadNext={() => {
          const page = fetcher.data ? fetcher.data.page + 1 : initialPage + 1;
          const query = `?index&page=${page}`;
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
  return getPopularMovies({ page: searchParams.get('page') });
}

export async function action({ request }: ActionArgs) {
  try {
    const user = await getUserSession(request.headers.get('Cookie'));
    if (!user) {
      throw new Error('Please login.');
    }

    const formData = await request.formData();
    const { movieId } = Object.fromEntries(formData);

    if (request.method === 'DELETE') {
      await deleteWatchListItem(movieId.toString(), user.id);
    } else {
      await addToWatchList(movieId.toString(), user.id);
    }

    return {
      error: null,
      ok: true,
    };
  } catch (error: any) {
    return { error: error.message, ok: false };
  }
}

export function ErrorBoundary({ error }: any) {
  return <p>{error.message}</p>;
}
