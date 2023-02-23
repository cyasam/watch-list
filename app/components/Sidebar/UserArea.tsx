import { Box, Button, Typography } from '@mui/material';
import { Form, useLoaderData } from '@remix-run/react';

function UserArea() {
  const { user } = useLoaderData();
  return (
    <Box
      display="flex"
      alignItems="center"
      padding={(theme) => theme.spacing(3)}
    >
      <Box width="100%">
        <Typography>{user.fullname}</Typography>
        <Typography fontSize={13} color={(theme) => theme.palette.grey[500]}>
          {user.email}
        </Typography>
      </Box>
      <Form method="post" action="/logout">
        <Button type="submit">Logout</Button>
      </Form>
    </Box>
  );
}

export default UserArea;
