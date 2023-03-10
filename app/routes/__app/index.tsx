import { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import CardItem from '~/components/CardItem';
import InfiniteScroller from '~/components/InfiniteScroller';
import { getMovies, movieActions } from '~/data/movies.server';
import { pageTitle } from '~/root';

export default function Index() {
  const popularMovies: any = useLoaderData();
  const fetcher = useFetcher();
  const [movies, setMovies] = useState(popularMovies?.results);
  const [totalPages] = useState(popularMovies?.total_pages);

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
          if (movies.length === 0 || totalPages === 1) {
            return;
          }

          const page = fetcher.data ? fetcher.data.page + 1 : initialPage + 1;

          const query = `?index&page=${page}`;
          fetcher.load(query);
        }}
      >
        <Grid container spacing={2}>
          {movies.map((movie: any) => {
            return (
              <Grid item xs={3} key={movie.id}>
                <CardItem item={movie} />
              </Grid>
            );
          })}
        </Grid>
      </InfiniteScroller>

      {fetcher.data?.page !== totalPages && (
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
      )}
    </Box>
  );
}

export const meta: MetaFunction = () => {
  return {
    title: `Popular - ${pageTitle}`,
  };
};

export async function loader({ request }: LoaderArgs) {
  const searchParams: any = new URL(request.url).searchParams;

  const page = searchParams.get('page') ?? '1';
  return getMovies({ page, type: 'popular' });
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
