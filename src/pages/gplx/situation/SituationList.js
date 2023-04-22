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
import Markdown from '../../../components/Markdown';
import { TableNoData } from '../../../components/table';
import { useDispatch, useSelector } from '../../../redux/store';
import VideoMoreMenu from '../../../sections/gplx/situation/SituationMoreMenu';
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
import { getGPLXSituations, setGPLXSituationSearch } from '../../../redux/slices/gplx/gplx.situation';
import { deleteGPLXSituationAPI, deleteGPLXSituationsAPI, processGPLXSituationAPI } from '../../../service/gplx/gplx.situation.service';
// sections
import DataGridListHead from '../../../components/datagrid/DataGridListHead';
import DataGridListToolbar from '../../../components/datagrid/DataGridListToolbar';
import { FormProvider } from '../../../components/hook-form';
import Image from '../../../components/Image';
import Label from '../../../components/Label';
import TableFilterSlidebar from '../../../components/table/TableFilterSlidebar';
import VideoPlayerPreview from '../../../components/VideoPlayerPreview';
import { mediaBaseURL } from '../../../config';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function SituationList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const TABLE_HEAD = [
    { id: 'orderNo', label: translate('gplx.category.orderNo'), alignRight: false, checked: true, sort: true },
    { id: 'title', label: translate('gplx.situation.title'), alignRight: false, checked: true, sort: true },
    { id: 'duration', label: translate('gplx.situation.duration'), alignRight: false, checked: true, sort: false },
    { id: 'start', label: translate('gplx.situation.start'), alignRight: false, checked: true, sort: false },
    { id: 'end', label: translate('gplx.situation.end'), alignRight: false, checked: true, sort: false },
    { id: 'status', label: translate('gplx.situation.status'), alignRight: false, checked: true, sort: false },
    { id: 'filename', label: translate('gplx.situation.filename'), alignRight: false, checked: false, sort: false },
    { id: 'category', label: translate('gplx.situation.category'), alignRight: false, checked: true, sort: false },
    { id: 'metaTitle', label: translate('gplx.situation.metaTitle'), alignRight: false, checked: false, sort: true },
    { id: 'slug', label: translate('gplx.situation.slug'), alignRight: false, checked: false, sort: false },
    { id: 'metaDescription', label: translate('gplx.situation.metaDescription'), alignRight: false, checked: false, sort: false, },
    { id: 'description', label: translate('gplx.situation.description'), alignRight: false, checked: false, sort: false, },
    { id: 'createdAt', label: translate('gplx.situation.createdAt'), alignRight: false, checked: false, sort: true },
    { id: '', label: translate('label.actions'), alignRight: true, checked: true, sort: false }
  ];
  const { situations, totalElements, numberOfElements, search, error } = useSelector((state) => state.situation);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openFilter, setOpenFilter] = useState(false);

  const [video, setVideo] = useState({});
  const [openVideoPreview, setOpenVideoPreview] = useState(false);

  const previewVideo = async (item) => {
    setVideo(item);
    setOpenVideoPreview(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getGPLXSituations());
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);// eslint-disable-line react-hooks/exhaustive-deps

  // sap xep
  const handleRequestSort = (property) => {
    const isAsc = search.orders[0].property === property && search.orders[0].order === 'asc';
    const order = (isAsc ? 'desc' : 'asc');

    dispatch(setGPLXSituationSearch({
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
      const selected = situations.map((n) => n.id);
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
    dispatch(setGPLXSituationSearch({
      ...search, page: 0, size: parseInt(event.target.value, 10)
    }));
  };

  const handleChangePage = (page) => {
    dispatch(setGPLXSituationSearch({
      ...search, page
    }));
  };

  const handleFilterByName = (value) => {
    dispatch(setGPLXSituationSearch({
      ...search, value
    }));
  };

  const handleDeleteItem = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const handleProcessItem = async (id) => {
    const resp = await processGPLXSituationAPI(id);

    if (resp.code === "200") {
      enqueueSnackbar(translate('message.updateSuccess'), { variant: 'success' });
      dispatch(getGPLXSituations());
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  const confirmDeleteItem = async () => {
    let resp;
    if (selected.length > 0)
      resp = await deleteGPLXSituationsAPI(selected);
    else
      resp = await deleteGPLXSituationAPI(selectedId);

    handleDeleteResponse(resp);
  };

  const handleDeleteItems = async () => {
    setOpen(true);
  };

  const handleDeleteResponse = (resp) => {
    setOpen(false);
    if (resp.code === "200") {
      enqueueSnackbar(translate('message.deleteSuccess'), { variant: 'success' });
      dispatch(getGPLXSituations());
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
    <Page title={translate('gplx.situation.listSituation')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('gplx.situation.listSituation')}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            { name: translate('menu.situation') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.gplx.newSituation}
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
                  {situations.map((row) => {
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

                          if (head.id === 'title')
                            return (
                              <TableCell sx={{ display: 'flex', alignItems: 'center' }} key={head.id}>
                                <Image
                                  onClick={() => previewVideo(row)}
                                  disabledEffect
                                  alt={row[head.id]}
                                  src={`${mediaBaseURL}/stream/video/${id}/thumbnail/thumb.jpg?token=${row.token}`}
                                  sx={{ borderRadius: 1.5, width: 64, height: 64, mr: 2 }}
                                />
                                <Typography variant="subtitle2">
                                  {row[head.id]}
                                  <br />
                                  <Typography variant="caption">{row.id}</Typography>
                                </Typography>
                              </TableCell>
                            );

                          if (head.id === 'status')
                            return (
                              <TableCell key={head.id}>
                                <Label
                                  color={
                                    (row[head.id] === 'ACTIVE' && 'success') ||
                                    (row[head.id] === 'PROCESS' && 'warning') ||
                                    (row[head.id] === 'DRAFT' && 'default') ||
                                    'error'
                                  }
                                >
                                  {row[head.id]}
                                </Label>
                              </TableCell>
                            );

                          if (head.id === '')
                            return <TableCell align="right" key={head.id}>
                              <VideoMoreMenu pathEdit={`${PATH_DASHBOARD.gplx.root}/situation/${id}/edit`}
                                pathView={`${PATH_DASHBOARD.gplx.root}/situation/${id}/view`}
                                onDelete={() => handleDeleteItem(id)} onProcess={() => handleProcessItem(id)} />
                            </TableCell>;

                          if (head.id === 'category')
                            return <TableCell key={head.id}>
                              <Typography variant="subtitle2" noWrap>
                                {row[head.id].title}
                              </Typography>
                            </TableCell>;

                          if (head.id === 'description')
                            return (
                              <TableCell key={head.id}>
                                <Markdown children={row[head.id]} />
                              </TableCell>
                            );

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
            onPageChange={(_, value) => handleChangePage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <ConfirmDialog values={{ title: translate("message.dialogDeleteTitle"), content: translate("message.dialogDeleteContent") }}
          onClose={() => setOpen(false)} isOpen={open} onSubmit={confirmDeleteItem} />
      </Container>
      <VideoPlayerPreview
        video={video}
        isOpen={openVideoPreview}
        onClose={() => setOpenVideoPreview(false)}
      />
    </Page >
  );
}
