import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
// routes
import useLocales from '../../../hooks/useLocales';
import { getMediaRoles, setMediaRoleSearch } from '../../../redux/slices/gplx/gplx.role';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider, RHFRadioGroup, RHFSwitch, RHFTextField
} from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { createMediaPrivilegeAPI, updateMediaPrivilegeAPI } from '../../../service/gplx/gplx.privilege.service';

// ----------------------------------------------------------------------
const HTTP_METHOD = ["GET", "POST", "DELETE", "PUT"];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

PrivilegeNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  item: PropTypes.object,
};

export default function PrivilegeNewForm({ isEdit, isView, item }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { roles, search: searchRole, isLoading: isLoadingRole } = useSelector((state) => state.mediaRole);
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaRoles());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchRole]);// eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterRole = (value) => {
    dispatch(setMediaRoleSearch({ ...searchRole, value }));
  };

  const NewItemSchema = Yup.object().shape({
    authority: Yup.string().required(translate('validation.required')),
    api: Yup.string().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      authority: item?.authority || '',
      api: item?.api || '',
      method: item?.method || HTTP_METHOD[0],
      secured: item?.secured || false,
      authenticated: item?.authenticated || false,
      roles: item?.roles || [],
      id: item?.id || '',
    }),
    [item]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = async (data) => {
    let resp;
    if (isEdit)
      resp = await updateMediaPrivilegeAPI(data);
    else
      resp = await createMediaPrivilegeAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.gplx.privileges);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="authority" label={translate('media.privilege.authority')} disabled={isView} />
              <RHFTextField name="api" label={translate('media.privilege.api')} disabled={isView} />
              <div>
                <LabelStyle>{translate('media.privilege.method')}</LabelStyle>
                <RHFRadioGroup
                  disabled={isView}
                  name="method"
                  options={HTTP_METHOD}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 4 },
                  }}
                />
              </div>
              <div>
                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete disabled={isView}
                      {...field}
                      multiple
                      onChange={(_, newValue) => field.onChange(newValue)}
                      options={roles.map(({ id, role }) => ({ id, role }))}
                      getOptionLabel={(option) => option?.role || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingRole}
                      onInputChange={(_, value) => {
                        handleFilterRole(value);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option.id} size="small" label={option?.role} />
                        ))
                      }
                      renderInput={(params) => <TextField label={translate('media.privilege.roles')} {...params} />}
                    />
                  )}
                />
              </div>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>
                <RHFSwitch name="secured" label={translate('media.privilege.secured')} disabled={isView} />
                <RHFSwitch name="authenticated" label={translate('media.privilege.authenticated')} disabled={isView} />
              </Stack>
            </Card>
            {
              isView ? (<Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.gplx.root}/privilege/${item?.id}/edit`}
                size="large"
                startIcon={<Iconify icon={'eva:edit-fill'} />}
              >
                {translate('button.edit')}
              </Button>) : (<LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? translate('button.new') : translate('button.save')}
              </LoadingButton>)
            }
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
