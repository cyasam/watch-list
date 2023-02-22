import { Alert, Snackbar } from '@mui/material';

interface Props {
  open: boolean;
  onClose(): void;
  children: React.ReactNode;
}

function Error({ open, onClose, children }: Props) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity="error" sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  );
}

export default Error;
