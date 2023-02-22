import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose(): void;
  children: React.ReactNode;
}

function Loading({ open, onClose, children }: Props) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity="info" icon={false} sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: 1.5 }}>
            <CircularProgress size="1rem" />
          </Box>
          <Typography fontSize="14px">{children}</Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
}

export default Loading;
