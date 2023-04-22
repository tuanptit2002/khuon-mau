import PropTypes from 'prop-types';
// form
// @mui
import {
    Box, Button, Divider, Drawer, IconButton, Stack, Typography
} from '@mui/material';
// @types
import { NAVBAR } from '../../config';
// components
import { RHFMultiCheckbox } from '../hook-form';
import Iconify from '../Iconify';
import Scrollbar from '../Scrollbar';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

TableFilterSlidebar.propTypes = {
    isOpen: PropTypes.bool,
    onResetAll: PropTypes.func,
    onClose: PropTypes.func,
    columns: PropTypes.array
};

export default function TableFilterSlidebar({ isOpen, onResetAll, onClose, columns }) {
    const { translate } = useLocales();
    return (
        <>
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={onClose}
                PaperProps={{
                    sx: { width: NAVBAR.BASE_WIDTH },
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        {translate('label.filters')}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Iconify icon={'eva:close-fill'} width={20} height={20} />
                    </IconButton>
                </Stack>

                <Divider />

                <Scrollbar>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle1">{translate('label.columns')}</Typography>
                            <RHFMultiCheckbox name="checkedColumns" options={columns} sx={{ width: 1 }} />
                        </Stack>
                    </Stack>
                </Scrollbar>

                <Box sx={{ p: 3 }}>
                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        color="inherit"
                        variant="outlined"
                        onClick={onResetAll}
                        startIcon={<Iconify icon={'ic:round-clear-all'} />}
                    >
                        {translate('button.clearAll')}
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}
