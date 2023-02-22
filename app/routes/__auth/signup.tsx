import { Alert, Box, Button, Link, TextField } from '@mui/material';
import type { ActionArgs } from '@remix-run/node';
import {
  Form,
  Link as RouterLink,
  useActionData,
  useTransition,
} from '@remix-run/react';
import { signup } from '~/data/auth.server';

function Signup() {
  const validationErrors = useActionData();
  const transition = useTransition();

  const isCreating = transition.state !== 'idle';

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
            name="fullname"
            label="Full Name"
            variant="outlined"
            error={!!validationErrors?.fullname}
            helperText={validationErrors?.fullname}
            required
          />
        </Box>

        <Box width="100%" marginBottom="1rem">
          <TextField
            fullWidth
            name="email"
            label="Email"
            variant="outlined"
            type="email"
            error={!!validationErrors?.email}
            helperText={validationErrors?.email}
            required
          />
        </Box>

        <Box width="100%" marginBottom="1rem">
          <TextField
            fullWidth
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            error={!!validationErrors?.password}
            helperText={validationErrors?.password}
            required
          />
        </Box>
        <Box width="100%" marginBottom="1rem">
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            type="password"
            error={!!validationErrors?.confirmPassword}
            helperText={validationErrors?.confirmPassword}
            required
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Link component={RouterLink} underline="hover" to="/login">
            Login your account
          </Link>
          <Button disabled={isCreating} type="submit" variant="contained">
            {isCreating ? 'Creating User' : 'Sign Up'}
          </Button>
        </Box>
      </Box>
    </Form>
  );
}

export default Signup;

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { fullname, email, password, confirmPassword } =
    Object.fromEntries(formData);
  const validationErrors: any = {};

  try {
    if (fullname.length === 0) {
      validationErrors.fullname = 'Full name required';
    }

    if (email.length === 0) {
      validationErrors.email = 'Email required';
    }

    if (password.length === 0) {
      validationErrors.password = 'Password required';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Password not matched.';
    }

    if (Object.values(validationErrors).length > 0) {
      throw validationErrors;
    }

    return await signup({ fullname, email, password });
  } catch (error: any) {
    if (error.status === 422) {
      return { message: error.message };
    }

    return error;
  }
}
