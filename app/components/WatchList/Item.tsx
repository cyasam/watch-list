import { Box, Button, Chip, Typography } from '@mui/material';
import { formatDate } from '~/utils/formatDate';

const POSTER_IMAGE_BASEURL = 'https://image.tmdb.org/t/p/w200';

function Item({ item, onDelete }: any) {
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
          onClick={() => onDelete(item.id)}
          sx={{ marginTop: 1.5 }}
        >
          Remove
        </Button>
      </Box>
    </Box>
  );
}

export default Item;
