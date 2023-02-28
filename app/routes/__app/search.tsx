import { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react';
import CardItem from '~/components/CardItem';
import InfiniteScroller from '~/components/InfiniteScroller';
import { getSearchMovies, movieActions } from '~/data/movies.server';
import { AnimatedDiv } from '../__app';
import { AnimatePresence } from 'framer-motion';
import { pageTitle } from '~/root';

export default function SearchPage() {
  const searchMovies: any = useLoaderData();
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = useState(searchMovies?.results);
  const [totalPages, setTotalPages] = useState(searchMovies?.total_pages);

  const searchQuery = searchParams.get('query');
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return;
    }

    setMovies((prevMovies: any) => [...prevMovies, ...fetcher.data.results]);
  }, [fetcher.data, fetcher.state]);

  useEffect(() => {
    if (query !== searchQuery) {
      setMovies(searchMovies?.results);
      setTotalPages(searchMovies?.total_pages);
      setQuery(searchQuery);
    }
  }, [query, searchQuery, searchMovies?.results, searchMovies?.total_pages]);

  const initialPage = searchMovies.page;

  return (
    <AnimatePresence mode="wait">
      <AnimatedDiv
        key={searchQuery}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {movies.length === 0 ? (
          <Typography>Couldn't find any movie...</Typography>
        ) : (
          <Box position="relative">
            <InfiniteScroller
              loading={fetcher.state === 'loading'}
              loadNext={() => {
                if (movies.length === 0 || totalPages === 1) {
                  return;
                }

                const page = fetcher.data
                  ? fetcher.data.page + 1
                  : initialPage + 1;

                const query = `/search?query=${searchQuery}&page=${page}`;
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

            {totalPages > 1 && fetcher.data?.page !== totalPages && (
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
        )}
      </AnimatedDiv>
    </AnimatePresence>
  );
}

export const meta: MetaFunction = ({ location }) => {
  const query = location.search.replace('?query=', '');
  return {
    title: `Search: ${query} - ${pageTitle}`,
  };
};

export async function loader({ request }: LoaderArgs) {
  const searchParams: any = new URL(request.url).searchParams;

  const page = searchParams.get('page') ?? '1';
  const query = searchParams.get('query') ?? '';
  return getSearchMovies({ page, query });
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
