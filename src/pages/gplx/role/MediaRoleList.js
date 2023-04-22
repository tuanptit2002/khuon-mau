import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Button,
  Card, Checkbox, Container, Table, TableBody,
  TableCell, TableContainer,
  TablePagination, TableRow, Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
// redux
import { TableNoData } from '../../../components/table';
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import Iconify from '../../../components/Iconify';
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
// sections
import ConfirmDialog from '../../../components/ConfirmDialog';
import { getMediaRoles, setMediaRoleSearch } from '../../../redux/slices/gplx/gplx.role';
import { deleteMediaRoleAPI, deleteMediaRolesAPI } from '../../../service/gplx/gplx.role.service';
// sections
import DataGridListHead from '../../../components/datagrid/DataGridListHead';
import DataGridListToolbar from '../../../components/datagrid/DataGridListToolbar';
import DataGridMoreMenu from '../../../components/datagrid/DataGridMoreMenu';
import { FormProvider } from '../../../components/hook-form';
import TableFilterSlidebar from '../../../components/table/TableFilterSlidebar';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function MediaRoleList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const TABLE_HEAD = [
    { id: 'id', label: translate('media.role.id'), alignRight: false, checked: true, sort: true },
    { id: 'role', label: translate('media.role.role'), alignRight: false, checked: true, sort: true },
    { id: 'privileges', label: translate('media.role.privileges'), alignRight: false, checked: false, sort: false },
    { id: '', label: translate('label.actions'), alignRight: true, checked: true, sort: false }
  ];

  const { roles, totalElements, numberOfElements, search, error } = useSelector((state) => state.mediaRole);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaRoles());
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);// eslint-disable-line react-hooks/exhaustive-deps

  // sap xep
  const handleRequestSort = (property) => {
    const isAsc = search.orders[0].property === property && search.orders[0].order === 'asc';
    const order = (isAsc ? 'desc' : 'asc');

    dispatch(setMediaRoleSearch({
      ...search, orders: [
        {
          order,
          property
        }
      ]
    }));
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = roles.map((n) => n.id);
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

  const handleChangeRowsPerPage = (event) => {
    dispatch(setMediaRoleSearch({
      ...search, page: 0, size: parseInt(event.target.value, 10)
    }));
  };

  const handleChangePage = (page) => {
    dispatch(setMediaRoleSearch({
      ...search, page
    }));
  };

  const handleFilterByName = (value) => {
    dispatch(setMediaRoleSearch({
      ...search, value
    }));
  };

  const handleDeleteItem = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDeleteItem = async () => {
    let resp;
    if (selected.length > 0)
      resp = await deleteMediaRolesAPI(selected);
    else
      resp = await deleteMediaRoleAPI(selectedId);

    handleDeleteResponse(resp);
  };

  const handleDeleteItems = async () => {
    setOpen(true);
  };

  const handleDeleteResponse = (resp) => {
    setOpen(false);
    if (resp.code === "200") {
      enqueueSnackbar(translate('message.deleteSuccess'), { variant: 'success' });
      dispatch(getMediaRoles());
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
    <Page title={translate('media.role.listRole')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('media.role.listRole')}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            { name: translate('menu.role') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.gplx.newRole}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('button.new')}
            </Button>
          }
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
          <DataGridListToolbar
            numSelected={selected.length}
            filterName={search.value}
            onFilterName={handleFilterByName}
            onDelete={() => handleDeleteItems()}
            showFilter={handleOpenFilter}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DataGridListHead
                  order={search.orders[0].order}
                  orderBy={search.orders[0].property}
                  headLabel={TABLE_HEAD.filter(head => checkedColumns.indexOf(head.label) > -1)}
                  rowCount={numberOfElements}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {roles.map((row) => {
                    const { id } = row;

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
                              <DataGridMoreMenu pathEdit={`${PATH_DASHBOARD.gplx.root}/role/${id}/edit`}
                                pathView={`${PATH_DASHBOARD.gplx.root}/role/${id}/view`} onDelete={() => handleDeleteItem(id)} />
                            </TableCell>;

                          if (head.id === 'privileges')
                            return (<TableCell key={head.id}>
                              {row[head.id]?.map((p) => (
                                <Typography variant="body2" key={p.id}>
                                  - {p.api}
                                </Typography>
                              ))}
                            </TableCell>);

                          return (<TableCell key={head.id}>
                            {row[head.id]}
                          </TableCell>);
                        })}

                      </TableRow>
                    );
                  })}

                  <TableNoData
                    isNotFound={numberOfElements === 0}
                    error={error}
                    length={checkedColumns.length + 1}
                    searchQuery={search.value}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalElements}
            rowsPerPage={search.size}
            page={search.page}
            onPageChange={(event, value) => handleChangePage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <ConfirmDialog values={{ title: translate("message.dialogDeleteTitle"), content: translate("message.dialogDeleteContent") }}
          onClose={() => setOpen(false)} isOpen={open} onSubmit={confirmDeleteItem} />
      </Container>
    </Page >
  );
}

