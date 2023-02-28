import { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { Link as RouterLink, useMatches } from '@remix-run/react';

function Navigation() {
  const matches = useMatches();

  const isActive = useCallback(
    (routeId: string) => {
      return !!matches.find((match) => match.id === routeId);
    },
    [matches]
  );
  return (
    <Box>
      <Button
        variant={isActive('routes/__app/index') ? 'contained' : 'outlined'}
        component={RouterLink}
        to="/"
        sx={{ marginRight: 3 }}
      >
        Popular
      </Button>
      <Button
        variant={isActive('routes/__app/top-rated') ? 'contained' : 'outlined'}
        component={RouterLink}
        to="/top-rated"
        sx={{ marginRight: 3 }}
      >
        Top Rated
      </Button>
    </Box>
  );
}

export default Navigation;
