import { css } from '@emotion/css';
import { Box, Grid } from '@mui/material';
import { Outlet } from '@remix-run/react';

function AuthLayout() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={5} height="100vh">
        <img
          src="assets/images/auth-image.jpg"
          alt="movie"
          className={css`
            width: 100%;
            height: 100%;
            object-fit: cover;
          `}
        />
      </Grid>
      <Grid item xs={7}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}

export default AuthLayout;
