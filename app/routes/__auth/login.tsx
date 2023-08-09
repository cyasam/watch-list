import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
} from '@mui/material';
import type { ActionArgs } from '@remix-run/node';
import {
  Form,
  Link as RouterLink,
  useActionData,
  useNavigation,
} from '@remix-run/react';
import { login } from '~/data/auth.server';

function Login() {
  const validationErrors = useActionData();
  const transition = useNavigation();

  const isSigning = transition.state !== 'idle';
  return (
    <Form method="post">
      {validationErrors?.message && (
        <Box mb={(theme) => theme.spacing(3)}>
          <Alert severity="error">{validationErrors.message}</Alert>
        </Box>
      )}
      <Box minWidth="300px" width="100%">
        <Box width="100%" marginBottom="1rem">
          <TextField
            fullWidth
            name="email"
            label="Email"
            variant="outlined"
            type="email"
            required
            error={!!validationErrors?.email}
            helperText={validationErrors?.email}
          />
        </Box>

        <Box width="100%" marginBottom="1rem">
          <TextField
            fullWidth
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            required
            error={!!validationErrors?.password}
            helperText={validationErrors?.password}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Link component={RouterLink} underline="hover" to="/signup">
            Create new account
          </Link>
          <Button disabled={isSigning} type="submit" variant="contained">
            {isSigning ? <CircularProgress size="1.5rem" /> : 'Login'}
          </Button>
        </Box>
      </Box>
    </Form>
  );
}

export default Login;

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);
  const validationErrors: any = {};

  try {
    if (email.length === 0) {
      validationErrors.email = 'Email required';
    }

    if (password.length === 0) {
      validationErrors.password = 'Password required';
    }

    if (Object.values(validationErrors).length > 0) {
      throw validationErrors;
    }

    return await login({ email, password });
  } catch (error: any) {
    if (error.status === 422) {
      return { message: error.message };
    }

    return error;
  }
}
