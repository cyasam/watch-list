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
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '~/utils/formatDate';
import Loading from './Alerts/Loading';
import Success from './Alerts/Success';
import Error from './Alerts/Error';

const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const tmdbMovieDetailBaseUrl = 'https://www.themoviedb.org/movie';

function CardItem({ item }: any) {
  const { id, title, poster_path, release_date, vote_average } = item;
  const [openSnack, setSnack] = useState(false);
  const [type, setType] = useState<string>();

  const matches = useMatches();
  const { user, watchList } = matches.find(
    (match) => match.id === 'routes/__app'
  )?.data;

  const fetcher = useFetcher();

  const clickAddButton = useCallback(() => {
    fetcher.submit({ movieId: id }, { method: 'post' });
    setSnack(true);
    setType('post');
  }, [fetcher, id]);

  const clickDeleteButton = useCallback(() => {
    fetcher.submit({ movieId: id }, { method: 'delete' });
    setSnack(true);
    setType('delete');
  }, [fetcher, id]);

  const onSnackClose = useCallback(() => {
    setSnack(false);
  }, []);

  const addedItem = useMemo(
    () => !!watchList?.data.find((item: any) => item.id === id),
    [id, watchList?.data]
  );

  const imageUrl = useMemo(() => {
    if (!poster_path || poster_path.length === 0) {
      return null;
    }

    return `${imageBaseUrl}${poster_path}`;
  }, [poster_path]);

  const detailUrl = useMemo(() => {
    return `${tmdbMovieDetailBaseUrl}/${id}`;
  }, [id]);

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
          <a href={detailUrl} target="_blank" rel="noreferrer">
            <Box position="relative" mb={1}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  width="500"
                  height="750"
                  loading="lazy"
                  className={css`
                    width: 100%;
                    height: auto;
                    border-radius: 5px;
                  `}
                />
              ) : (
                <Box
                  width="100%"
                  sx={{ aspectRatio: '10/15' }}
                  bgcolor="rgba(255,255,255,0.1)"
                  borderRadius="5px"
                />
              )}
              <Chip
                color="primary"
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  fontWeight: '600',
                }}
                label={vote_average.toFixed(1)}
              />
            </Box>
          </a>

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
                  disabled={fetcher.state !== 'idle'}
                  onClick={clickDeleteButton}
                />
              ) : (
                <AddButton
                  disabled={!user || fetcher.state !== 'idle'}
                  onClick={clickAddButton}
                />
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
          <Button size="small" target="_blank" href={detailUrl}>
            Learn More
          </Button>
        </CardActions>
      </Card>

      {fetcher.state !== 'idle' && (
        <Loading open={openSnack} onClose={onSnackClose}>
          {type === 'delete' ? 'Deleting...' : 'Adding...'}
        </Loading>
      )}

      {fetcher.state === 'idle' && (
        <>
          {fetcher.data?.ok && (
            <Success open={openSnack} onClose={onSnackClose}>
              {fetcher.data?.type === 'delete'
                ? 'Succesfully deleted!'
                : 'Succesfully added!'}
            </Success>
          )}
          {!fetcher.data?.ok && (
            <Error open={openSnack} onClose={onSnackClose}>
              {fetcher.data?.error}
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
      <Tooltip title="Add to watch list" placement="bottom">
        <span>
          <IconButton onClick={onClick} disabled={disabled}>
            <AddIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

const DeleteButton = ({ disabled, onClick }: AddButtonProps) => {
  return (
    <Box display="inline-flex">
      <Tooltip title="Remove from watch list" placement="bottom">
        <span>
          <IconButton onClick={onClick} disabled={disabled}>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
