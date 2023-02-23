import { Box, Button, Chip, Typography } from '@mui/material';
import { useFetcher } from '@remix-run/react';
import { useCallback, useState } from 'react';
import { formatDate } from '~/utils/formatDate';
import Error from '../Alerts/Error';
import Loading from '../Alerts/Loading';

const POSTER_IMAGE_BASEURL = 'https://image.tmdb.org/t/p/w200';

function Item({ item }: any) {
  const fetcher = useFetcher();
  const [openSnack, setSnack] = useState(false);

  const onDelete = useCallback(() => {
    fetcher.submit(
      { movieId: item.id },
      { method: 'delete', action: '/?index' }
    );
    setSnack(true);
  }, [fetcher, item.id]);

  const onSnackClose = useCallback(() => {
    setSnack(false);
  }, []);

  return (
    <Box display="flex" mb={1.5}>
      <Box mr="1rem">
        <img
          src={`${POSTER_IMAGE_BASEURL}${item.poster_path}`}
          width="80"
          alt={item.title}
        />
      </Box>
      <Box>
        <Typography component="h4">{item.title}</Typography>
        <Box display="flex" alignItems="center">
          <Typography fontSize={13}>{formatDate(item.release_date)}</Typography>
          <Chip
            sx={{ marginLeft: 1.5 }}
            size="small"
            label={item.vote_average.toFixed(1)}
          />
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={onDelete}
          sx={{ marginTop: 1.5 }}
        >
          Delete
        </Button>
      </Box>

      {fetcher.state !== 'idle' && (
        <Loading open={openSnack} onClose={onSnackClose}>
          Deleting...
        </Loading>
      )}

      {fetcher.type === 'done' && (
        <>
          {!fetcher.data.ok && (
            <Error open={openSnack} onClose={onSnackClose}>
              {fetcher.data.error}
            </Error>
          )}
        </>
      )}
    </Box>
  );
}

export default Item;
