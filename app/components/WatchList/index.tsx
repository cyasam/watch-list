import { useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';

import Error from '../Alerts/Error';
import Loading from '../Alerts/Loading';
import Success from '../Alerts/Success';
import Item from './Item';

function WatchList() {
  const { user, watchList } = useLoaderData();
  const fetcher = useFetcher();
  const [openSnack, setSnack] = useState(false);

  const onDelete = useCallback(
    (id: string) => {
      fetcher.submit({ movieId: id }, { method: 'delete', action: '/?index' });
      setSnack(true);
    },
    [fetcher]
  );

  const onSnackClose = useCallback(() => {
    setSnack(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <Box height="100%" overflow="auto" flex="1">
          {!user && (
            <Typography textAlign="center">You need to login.</Typography>
          )}
          {watchList?.data?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography textAlign="center">Let's add a new movie!</Typography>
            </motion.div>
          )}
          {watchList?.data?.map((item: any) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Item item={item} onDelete={onDelete} />
              </motion.div>
            );
          })}
          {watchList?.error && (
            <Typography textAlign="center">{watchList?.error}</Typography>
          )}
        </Box>
      </AnimatePresence>

      {fetcher.state !== 'idle' && (
        <Loading open={openSnack} onClose={onSnackClose}>
          Deleting...
        </Loading>
      )}

      {fetcher.state === 'idle' && (
        <>
          {fetcher.data?.ok && (
            <Success open={openSnack} onClose={onSnackClose}>
              Succesfully deleted!
            </Success>
          )}
          {!fetcher.data?.ok && (
            <Error open={openSnack} onClose={onSnackClose}>
              {fetcher.data?.error}
            </Error>
          )}
        </>
      )}
    </>
  );
}

export default WatchList;
