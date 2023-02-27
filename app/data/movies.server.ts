import axios from 'axios';
import { getUserSession } from './auth.server';
import { prisma } from './database.server';

const movieApi = axios.create({
  baseURL: `${process.env.MOVIE_API_URL}/movie`,
  params: {
    api_key: process.env.MOVIE_API_KEY,
  },
});

export const getMovies = async ({
  page,
  type,
}: {
  page: string;
  type: string;
}) => {
  try {
    const response = await movieApi.get(`/${type}`, { params: { page } });

    return response.data;
  } catch (error: any) {
    throw new Error('Could not load movies.');
  }
};

export const getWatchlist = async (userId: string) => {
  try {
    const watchListItems = await prisma.watchList.findMany({
      where: { userId },
      orderBy: { dateAdded: 'desc' },
    });

    if (!watchListItems) {
      throw new Error('Could not load watch list.');
    }

    const allPromises = watchListItems.map((item) =>
      getWatchlistItemPromise(item.movieId)
    );

    const responses = await Promise.all(allPromises);

    const movies = responses.map((response) => response.data);

    return { error: null, data: movies };
  } catch (error: any) {
    return { error: error.message, data: null };
  }
};

export const getWatchlistItemPromise = async (id: string) => {
  return movieApi.get(`/${id}`);
};

export const addToWatchList = async (movieId: string, userId: string) => {
  const existingItem = await prisma.watchList.findFirst({
    where: { movieId, userId },
  });

  if (existingItem) {
    throw new Error('Already in the list.');
  }

  const newItem = await prisma.watchList.create({
    data: { movieId, userId },
  });

  if (!newItem) {
    throw new Error('Could not added.');
  }

  return newItem;
};

export const deleteWatchListItem = async (movieId: string, userId: string) => {
  const deletedItem = await prisma.watchList.deleteMany({
    where: { movieId, userId },
  });

  return deletedItem;
};

export const movieActions = async (request: any) => {
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
    movieId: movieId.toString(),
    type: request.method === 'DELETE' ? 'delete' : 'add',
  };
};
