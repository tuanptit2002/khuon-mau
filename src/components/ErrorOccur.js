import { Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';

ErrorOccur.propTypes = {
  error: PropTypes.object,
};

export default function ErrorOccur({ error, ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1" color={"red"}>
        Error Code : {error.code}
      </Typography>
      <Typography variant="body2" align="center">
        {error.message}
      </Typography>
    </Paper>
  );
}