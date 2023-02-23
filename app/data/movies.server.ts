import axios from 'axios';
import { prisma } from './database.server';

const movieApi = axios.create({
  baseURL: `${process.env.MOVIE_API_URL}/movie`,
  params: {
    api_key: process.env.MOVIE_API_KEY,
  },
});

export const getPopularMovies = async () => {
  try {
    const response = await movieApi.get('/popular');

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
