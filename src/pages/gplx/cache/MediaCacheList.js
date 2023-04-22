import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import {
  Card, Checkbox, Container, Table, TableBody,
  TableCell, TableContainer,
  TablePagination, TableRow
} from '@mui/material';
import { useSnackbar } from 'notistack';
// redux
import { TableNoData } from '../../../components/table';
import { useDispatch, useSelector } from '../../../redux/store';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
// sections
import ConfirmDialog from '../../../components/ConfirmDialog';
import { getMediaCaches } from '../../../redux/slices/gplx/gplx.cache';
import { deleteMediaCacheAPI } from '../../../service/gplx/gplx.cache.service';
// sections
import DataGridListHead from '../../../components/datagrid/DataGridListHead';
import DataGridMoreMenu from '../../../components/datagrid/DataGridMoreMenu';
import { FormProvider } from '../../../components/hook-form';
import TableFilterSlidebar from '../../../components/table/TableFilterSlidebar';
import useLocales from '../../../hooks/useLocales';
import CacheListToolbar from '../../../sections/gplx/cache/CacheListToolbar';

// ----------------------------------------------------------------------

export default function MediaCacheList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const TABLE_HEAD = [
    { id: 'name', label: translate('media.cache.name'), alignRight: false, checked: true, sort: false },
    { id: '', label: translate('label.actions'), alignRight: true, checked: true, sort: false }
  ];

  const { caches, totalElements, numberOfElements, error } = useSelector((state) => state.mediaCache);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaCaches());
    }, 500);

    return () => clearTimeout(timeout);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  // sap xep
  const handleRequestSort = () => {
    getMediaCaches();
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = caches.map((id) => id);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = () => {
    getMediaCaches();
  };

  const handleChangePage = () => {
    getMediaCaches();
  };

  const handleDeleteItem = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDeleteItem = async () => {
    let resp;
    if (selected.length > 0)
      resp = (await Promise.all(
        selected.map(name => deleteMediaCacheAPI({ name }))
      ))[0];
    else
      resp = await deleteMediaCacheAPI({ name: selectedId });

    handleDeleteResponse(resp);
  };

  const handleDeleteItems = async () => {
    setOpen(true);
  };

  const handleDeleteResponse = (resp) => {
    setOpen(false);
    if (resp.code === "200") {
      enqueueSnackbar(translate('message.deleteSuccess'), { variant: 'success' });
      dispatch(getMediaCaches());
      setSelected([]);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  const defaultValues = {
    checkedColumns: TABLE_HEAD.filter(item => item.checked).map(item => item.label),
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch } = methods;

  const { checkedColumns } = watch();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  return (
    <Page title={translate('media.cache.listCache')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('media.cache.listCache')}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            { name: translate('menu.cache') },
          ]}
        />

        <FormProvider methods={methods}>
          <TableFilterSlidebar
            onResetAll={handleResetFilter}
            isOpen={openFilter}
            onOpen={handleOpenFilter}
            onClose={handleCloseFilter}
            columns={TABLE_HEAD.map(item => item.label)}
          />
        </FormProvider>

        <Card>
          <CacheListToolbar
            numSelected={selected.length}
            onDelete={() => handleDeleteItems()}
            showFilter={handleOpenFilter}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DataGridListHead
                  order={'asc'}
                  orderBy={'name'}
                  headLabel={TABLE_HEAD.filter(head => checkedColumns.indexOf(head.label) > -1)}
                  rowCount={numberOfElements}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {caches.map((row) => {
                    const id = row;

                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(id)} />
                        </TableCell>

                        {TABLE_HEAD.map(head => {
                          if (checkedColumns.indexOf(head.label) === -1) return null;

                          if (head.id === '')
                            return <TableCell align="right" key={head.id}>
                              <DataGridMoreMenu pathEdit={`${PATH_DASHBOARD.gplx.root}/cache/${id}/keys`}
                                pathView={`${PATH_DASHBOARD.gplx.root}/cache/${id}/keys`} onDelete={() => handleDeleteItem(id)} />
                            </TableCell>;

                          return (<TableCell key={head.id}>
                            {row}
                          </TableCell>);
                        })}
                      </TableRow>
                    );
                  })}
                  <TableNoData
                    isNotFound={numberOfElements === 0}
                    error={error}
                    length={checkedColumns.length + 1}
                    searchQuery={''}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[totalElements]}
            component="div"
            count={totalElements}
            rowsPerPage={totalElements}
            page={0}
            onPageChange={(_, value) => handleChangePage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <ConfirmDialog values={{ title: translate("message.dialogDeleteTitle"), content: translate("message.dialogDeleteContent") }}
          onClose={() => setOpen(false)} isOpen={open} onSubmit={confirmDeleteItem} />
      </Container>
    </Page >
  );
}

