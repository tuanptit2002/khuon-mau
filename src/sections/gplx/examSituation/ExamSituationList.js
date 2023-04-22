/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import {
  Avatar, Box, Card,
  Checkbox,
  Container, IconButton, Table,
  TableBody, TableCell,
  TableContainer,
  TablePagination, TableRow,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
// redux
// routes
// hooks
import Iconify from '../../../components/Iconify';
import useSettings from '../../../hooks/useSettings';
// components
import Scrollbar from '../../../components/Scrollbar';
// sections
import ConfirmDialog from '../../../components/ConfirmDialog';
import { deleteExamSituationAPI, deleteExamSituationsAPI, findExamSituationsAPI } from '../../../service/gplx/gplx.examSituation.service';
// sections
import DataGridListHead from '../../../components/datagrid/DataGridListHead';
import DataGridListToolbar from '../../../components/datagrid/DataGridListToolbar';
import { FormProvider } from '../../../components/hook-form';
import { TableNoData } from '../../../components/table';
import TableFilterSlidebar from '../../../components/table/TableFilterSlidebar';
import useLocales from '../../../hooks/useLocales';
import ExamSituationNewForm from "./ExamSituationNewForm";

export default function ExamSituationList({ item }) {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({
    examSituations: [], totalElements: 0, numberOfElements: 0, error: null, isLoading: false,
    search: { page: 0, size: 10, value: '', orders: [{ order: "desc", property: 'id' }], filterBys: { "exam.id": item?.id } },
  });
  const { examSituations, totalElements, numberOfElements, search, error } = data;

  const TABLE_HEAD = [
    { id: 'id', label: translate('gplx.examSituation.id'), alignRight: false, checked: false, sort: true },
    { id: 'orderNo', label: translate('gplx.examSituation.orderNo'), alignRight: false, checked: true, sort: true },
    { id: 'situation', label: translate('gplx.examSituation.situation'), alignRight: false, checked: true, sort: false },
    { id: '', label: translate('label.actions'), alignRight: true, checked: true, sort: false },
  ];

  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [openFilter, setOpenFilter] = useState(false);

  // goi lai redux neu search thay doi
  useEffect(() => {
    const timeout = setTimeout(() => {
      getGPLXExamSituations();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const getGPLXExamSituations = async () => {
    setData({ ...data, isLoading: true });
    const resp = await findExamSituationsAPI({ ...search, value: `%${search.value}%` });
    if (resp.code === '200')
      setData({ ...data, examSituations: resp.data, totalElements: resp.totalElements, numberOfElements: resp.numberOfElements, isLoading: false, error: null });
    else
      setData({ ...data, isLoading: false, error: resp });
  };

  // sap xep
  const handleRequestSort = (property) => {
    const isAsc = search.orders[0].property === property && search.orders[0].order === 'asc';
    const order = isAsc ? 'desc' : 'asc';
    setData({ search: { ...search, orders: [{ order, property }] }, examSituations, totalElements, numberOfElements, error: null });
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const selected = examSituations.map((n) => n.id);
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
    setData({ search: { ...search, page: 0, size: parseInt(event.target.value, 10) }, examSituations, totalElements, numberOfElements, error: null });
  };

  const handleChangePage = (page) => {
    setData({ search: { ...search, page }, examSituations, totalElements, numberOfElements, error: null });
  };

  const handleFilterByName = (value) => {
    setData({ search: { ...search, value }, examSituations, totalElements, numberOfElements, error: null });
  };

  const handleDeleteSeriesPost = async (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDeleteSeriesPost = async () => {
    let resp;
    if (selected.length > 0) resp = await deleteExamSituationsAPI(selected);
    else resp = await deleteExamSituationAPI(selectedId);

    handleDeleteResponse(resp);
  };

  const handleDeleteSectionPosts = async () => {
    setOpen(true);
  };

  const handleDeleteResponse = (resp) => {
    setOpen(false);
    if (resp.code === '200') {
      enqueueSnackbar(translate('message.deleteSuccess'), { variant: 'success' });
      getGPLXExamSituations();
      setSelected([]);
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  const defaultValues = {
    checkedColumns: TABLE_HEAD.filter((item) => item.checked).map((item) => item.label),
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
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            {translate('gplx.examSituation.listExamSituation')}
          </Typography>
        </Box>
      </Box>

      <FormProvider methods={methods}>
        <TableFilterSlidebar
          onResetAll={handleResetFilter}
          isOpen={openFilter}
          onOpen={handleOpenFilter}
          onClose={handleCloseFilter}
          columns={TABLE_HEAD.map((item) => item.label)}
        />
      </FormProvider>

      <Card>
        <ExamSituationNewForm exam={item} refresh={getGPLXExamSituations} />

        <DataGridListToolbar
          numSelected={selected.length}
          filterName={search.value}
          onFilterName={handleFilterByName}
          onDelete={() => handleDeleteSectionPosts()}
          showFilter={handleOpenFilter}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <DataGridListHead
                order={search.orders[0].order}
                orderBy={search.orders[0].property}
                headLabel={TABLE_HEAD.filter((head) => checkedColumns.indexOf(head.label) > -1)}
                rowCount={numberOfElements}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />

              <TableBody>
                {examSituations?.map((row) => {
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

                      {TABLE_HEAD.map((head) => {
                        if (checkedColumns.indexOf(head.label) === -1) return null;

                        if (head.id === '')
                          return (
                            <TableCell align="right" key={head.id}>
                              <IconButton onClick={() => handleDeleteSeriesPost(id)} sx={{ color: 'error.main' }}>
                                <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2, width: 20, height: 20, }} />
                              </IconButton>
                            </TableCell>
                          );
                        if (head.id === 'exam') return <TableCell key={head.id}>{row[head.id]?.title}</TableCell>;
                        if (head.id === 'situation')
                          return <TableCell key={head.id}>{row[head.id]?.title}</TableCell>;
                        if (head.id === 'createdBy')
                          return (
                            <TableCell sx={{ display: 'flex', alignItems: 'center' }} key={head.id}>
                              <Avatar
                                alt={row[head.id].displayName}
                                src={row[head.id].photoURL}
                                sx={{ mr: 2, alignItems: 'center' }}
                              />
                              <Typography variant="subtitle2" noWrap>
                                {row[head.id].displayName}
                              </Typography>
                            </TableCell>
                          );

                        return <TableCell key={head.id}>{row[head.id]}</TableCell>;
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
      <ConfirmDialog
        values={{ title: translate('message.dialogDeleteTitle'), content: translate('message.dialogDeleteContent') }}
        onClose={() => setOpen(false)}
        isOpen={open}
        onSubmit={confirmDeleteSeriesPost}
      />
    </Container >
  );
}