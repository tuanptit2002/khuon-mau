import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Button,
  Card, Checkbox, Container, MenuItem, Table, TableBody,
  TableCell, TableContainer,
  TablePagination, TableRow, Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// utils
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
import { getMediaPrivileges, setMediaPrivilegeSearch } from '../../../redux/slices/gplx/gplx.privilege';
import { deleteMediaPrivilegeAPI, deleteMediaPrivilegesAPI } from '../../../service/gplx/gplx.privilege.service';
// sections
import DataGridListHead from '../../../components/datagrid/DataGridListHead';
import DataGridListToolbar from '../../../components/datagrid/DataGridListToolbar';
import { FormProvider } from '../../../components/hook-form';
import { TableMoreMenu, TableNoData } from '../../../components/table';
import TableFilterSlidebar from '../../../components/table/TableFilterSlidebar';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function MediaPrivilegeList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const TABLE_HEAD = [
    { id: 'id', label: translate('media.privilege.id'), alignRight: false, checked: false, sort: true },
    { id: 'authority', label: translate('media.privilege.authority'), alignRight: false, checked: true, sort: true },
    { id: 'api', label: translate('media.privilege.api'), alignRight: false, checked: true, sort: true },
    { id: 'method', label: translate('media.privilege.method'), alignRight: false, checked: true, sort: false },
    { id: 'secured', label: translate('media.privilege.secured'), alignRight: false, checked: true, sort: false },
    { id: 'authenticated', label: translate('media.privilege.authenticated'), alignRight: false, checked: true, sort: false },
    { id: 'roles', label: translate('media.privilege.roles'), alignRight: false, checked: true, sort: false },
    { id: '', label: translate('label.actions'), alignRight: true, checked: true, sort: false }
  ];

  const { privileges, totalElements, numberOfElements, search, error } = useSelector((state) => state.mediaPrivilege);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaPrivileges());
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);// eslint-disable-line react-hooks/exhaustive-deps

  // sap xep
  const handleRequestSort = (property) => {
    const isAsc = search.orders[0].property === property && search.orders[0].order === 'asc';
    const order = (isAsc ? 'desc' : 'asc');

    dispatch(setMediaPrivilegeSearch({
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
      const selected = privileges.map((n) => n.id);
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
    dispatch(setMediaPrivilegeSearch({
      ...search, page: 0, size: parseInt(event.target.value, 10)
    }));
  };

  const handleChangePage = (page) => {
    dispatch(setMediaPrivilegeSearch({
      ...search, page
    }));
  };

  const handleFilterByName = (value) => {
    dispatch(setMediaPrivilegeSearch({
      ...search, value
    }));
  };

  const handleDelete = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDelete = async () => {
    let resp;
    if (selected.length > 0)
      resp = await deleteMediaPrivilegesAPI(selected);
    else
      resp = await deleteMediaPrivilegeAPI(selectedId);

    handleDeleteResponse(resp);
  };

  const handleDeleteCategorys = async () => {
    setOpen(true);
  };

  const handleDeleteResponse = (resp) => {
    setOpen(false);
    if (resp.code === "200") {
      enqueueSnackbar(translate('message.deleteSuccess'), { variant: 'success' });
      dispatch(getMediaPrivileges());
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
    <Page title={translate('media.privilege.listPrivilege')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('media.privilege.listPrivilege')}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            { name: translate('menu.privilege') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.gplx.newPrivilege}
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
            onDelete={() => handleDeleteCategorys()}
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
                  {privileges.map((row) => {
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
                              <TableMoreMenu
                                actions={
                                  <>
                                    <MenuItem onClick={() => handleDelete(id)} sx={{ color: 'error.main' }} >
                                      <Iconify icon={'eva:trash-2-outline'} />
                                      {translate("button.delete")}
                                    </MenuItem>

                                    <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.gplx.root}/privilege/${id}/view`} >
                                      <Iconify icon={'eva:eye-fill'} />
                                      {translate("button.view")}
                                    </MenuItem>

                                    <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.gplx.root}/privilege/${id}/edit`} >
                                      <Iconify icon={'eva:edit-fill'} />
                                      {translate("button.edit")}
                                    </MenuItem>
                                  </>
                                }
                              />
                            </TableCell>;

                          if (head.id === 'roles')
                            return (<TableCell key={head.id}>
                              {row[head.id]?.map((r) => (
                                <Typography variant="body2" key={r.id}>
                                  - {r.role}
                                </Typography>
                              ))}
                            </TableCell>);

                          return (<TableCell key={head.id}>
                            {row[head.id]?.toString()}
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
          onClose={() => setOpen(false)} isOpen={open} onSubmit={confirmDelete} />
      </Container>
    </Page >
  );
}

