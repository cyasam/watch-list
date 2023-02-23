import { useCallback, useMemo, useState } from 'react';
import { useFetcher, useMatches } from '@remix-run/react';
import { css } from '@emotion/css';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { formatDate } from '~/utils/formatDate';
import Loading from './Alerts/Loading';
import Success from './Alerts/Success';
import Error from './Alerts/Error';

const imageBaseUrl = 'https://image.tmdb.org/t/p/w400';
const tmdbMovieDetailBaseUrl = 'https://www.themoviedb.org/movie';

function CardItem({ item }: any) {
  const { id, title, backdrop_path, release_date, vote_average } = item;
  const [openSnack, setSnack] = useState(false);
  const matches = useMatches();
  const { user, watchList } = matches.find(
    (match) => match.id === 'routes/__app'
  )?.data;

  const fetcher = useFetcher();

  const clickAddButton = useCallback(() => {
    fetcher.submit({ movieId: id }, { method: 'post' });
    setSnack(true);
  }, [fetcher, id]);

  const clickDeleteButton = useCallback(() => {
    fetcher.submit({ movieId: id }, { method: 'delete' });
    setSnack(true);
  }, [fetcher, id]);

  const onSnackClose = useCallback(() => {
    setSnack(false);
  }, []);

  const addedItem = useMemo(
    () => !user || !!watchList?.data.find((item: any) => item.id === id),
    [id, user, watchList?.data]
  );

  return (
    <>
      <Card
        variant="outlined"
        className={css`
          display: flex;
          flex-direction: column;
          height: 100%;
        `}
      >
        <CardContent
          className={css`
            flex: 1;
          `}
        >
          <Box position="relative" mb={1}>
            <img
              src={`${imageBaseUrl}${backdrop_path}`}
              width="300"
              height="169"
              alt={title}
              loading="lazy"
              className={css`
                width: 100%;
                height: auto;
                border-radius: 5px;
              `}
            />
            <Chip
              color="primary"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontWeight: '600',
              }}
              label={vote_average}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h6" component="h3">
                {title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {formatDate(release_date)}
              </Typography>
            </Box>
            <Box ml={1.5}>
              {addedItem ? (
                <DeleteButton
                  disabled={openSnack}
                  onClick={clickDeleteButton}
                />
              ) : (
                <AddButton disabled={openSnack} onClick={clickAddButton} />
              )}
            </Box>
          </Box>
        </CardContent>
        <CardActions
          className={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <Button
            size="small"
            target="_blank"
            href={`${tmdbMovieDetailBaseUrl}/${id}`}
          >
            Learn More
          </Button>
        </CardActions>
      </Card>

      {fetcher.state === 'loading' && (
        <Loading open={openSnack} onClose={onSnackClose}>
          {fetcher.data.type === 'delete' ? 'Deleting...' : 'Adding...'}
        </Loading>
      )}

      {fetcher.type === 'done' && (
        <>
          {fetcher.data.ok && (
            <Success open={openSnack} onClose={onSnackClose}>
              {fetcher.data.type === 'delete'
                ? 'Succesfully deleted!'
                : 'Succesfully added!'}
            </Success>
          )}
          {!fetcher.data.ok && (
            <Error open={openSnack} onClose={onSnackClose}>
              {fetcher.data.error}
            </Error>
          )}
        </>
      )}
    </>
  );
}

export default CardItem;

interface AddButtonProps {
  disabled?: boolean;
  onClick(): void;
}

const AddButton = ({ disabled, onClick }: AddButtonProps) => {
  return (
    <Box display="inline-flex">
      <IconButton
        onClick={onClick}
        disabled={disabled}
        title="Add to watch list"
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

const DeleteButton = ({ disabled, onClick }: AddButtonProps) => {
  return (
    <Box display="inline-flex">
      <IconButton
        onClick={onClick}
        disabled={disabled}
        title="Remove from watch list"
      >
        <RemoveIcon />
      </IconButton>
    </Box>
  );
};
