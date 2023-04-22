import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Container, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// components
import { DialogAnimate } from './animate';
import Image from './Image';
import useLocales from '../hooks/useLocales';

// ----------------------------------------------------------------------

ConfirmDialog.propTypes = {
  values: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default function ConfirmDialog({ values, isOpen, onClose, onSubmit }) {
  const { title, content } = values;
  const {translate}=useLocales();

  return (
    <DialogAnimate open={isOpen} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent id="alert-dialog-description">
        <DialogContentText sx={{ mt: 3, mb: 1 }}>
          {content}
        </DialogContentText >
      </DialogContent>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Button onClick={onClose}>{translate('button.disagree')}</Button>
        <LoadingButton type="submit" variant="contained" onClick={onSubmit}>
        {translate('button.agree')}
        </LoadingButton>
      </DialogActions>
    </DialogAnimate>
  );
}

// ----------------------------------------------------------------------

PreviewHero.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
};

function PreviewHero({ title, cover }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Container
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          position: 'absolute',
          color: 'common.white',
          pt: { xs: 3, lg: 10 },
        }}
      >
        <Typography variant="h2" component="h1">
          {title}
        </Typography>
      </Container>

      <Box
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 8,
          position: 'absolute',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
        }}
      />
      <Image alt="cover" src={cover} ratio="16/9" />
    </Box>
  );
}
