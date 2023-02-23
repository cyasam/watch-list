import { css } from '@emotion/css';
import { Box, Button, Divider } from '@mui/material';
import { Link as RouterLink } from '@remix-run/react';

function AuthArea() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={(theme) => theme.spacing(3)}
    >
      <Button component={RouterLink} variant="contained" to="/login">
        Login
      </Button>
      <Box width="100%" marginY={(theme) => theme.spacing(1)}>
        <Divider
          className={css`
            width: 100%;
          `}
        >
          or
        </Divider>
      </Box>
      <Button component={RouterLink} to="signup">
        Sign Up
      </Button>
    </Box>
  );
}

export default AuthArea;
