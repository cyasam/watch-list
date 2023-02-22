import { Grid } from '@mui/material';
import type { ActionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import CardItem from '~/components/CardItem';
import { getUserSession } from '~/data/auth.server';
import { addToWatchList, getPopularMovies } from '~/data/movies.server';

export default function Index() {
  const popularMovies: any = useLoaderData();

  return (
    <Grid container spacing={2}>
      {popularMovies?.results.map((movie: any) => {
        return (
          <Grid key={movie.id} item xs={3}>
            <CardItem item={movie} />
          </Grid>
        );
      })}
    </Grid>
  );
}

export async function loader() {
  return getPopularMovies();
}

export async function action({ request }: ActionArgs) {
  const user = await getUserSession(request.headers.get('Cookie'));

  try {
    const formData = await request.formData();
    const { movieId } = Object.fromEntries(formData);

    if (!movieId || !user) {
      throw new Error('Could not added.');
    }

    await addToWatchList(movieId.toString(), user.id);

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
