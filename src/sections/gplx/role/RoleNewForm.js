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
import { getMediaPrivileges, setMediaPrivilegeSearch } from '../../../redux/slices/gplx/gplx.privilege';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider, RHFTextField
} from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { createMediaRoleAPI, updateMediaRoleAPI } from '../../../service/gplx/gplx.role.service';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

RoleNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentRole: PropTypes.object,
};

export default function RoleNewForm({ isEdit, isView, currentRole }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { privileges, search: searchPrivilege, isLoading: isLoadingPrivilege } = useSelector((state) => state.mediaPrivilege);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMediaPrivileges());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchPrivilege]);// eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterPrivilegeByTitle = (value) => {
    dispatch(setMediaPrivilegeSearch({ ...searchPrivilege, value }));
  };

  const NewItemSchema = Yup.object().shape({
    role: Yup.string().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      role: currentRole?.role || '',
      privileges: currentRole?.privileges || [],
      id: currentRole?.id || '',
    }),
    [currentRole]
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
      resp = await updateMediaRoleAPI(data);
    else
      resp = await createMediaRoleAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.gplx.roles);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFTextField name="role" label={translate('media.role.role')} disabled={isView} />
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>
                <div>
                  <Controller
                    name="privileges"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={privileges.map(({ id, api }) => ({ id, api }))}
                        getOptionLabel={(option) => option?.api || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        loading={isLoadingPrivilege}
                        onInputChange={(event, value) => {
                          handleFilterPrivilegeByTitle(value);
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option.id} size="small" label={option?.api} />
                          ))
                        }
                        renderInput={(params) => <TextField label={translate('media.role.privileges')} {...params} />}
                      />
                    )}
                  />
                </div>
              </Stack>
            </Card>
            {
              isView ? (<Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.gplx.root}/role/${currentRole?.id}/edit`}
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
