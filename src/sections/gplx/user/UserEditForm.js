import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Avatar, Button, Card, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider, RHFRadioGroup, RHFTextField
} from '../../../components/hook-form';
import useLocales from '../../../hooks/useLocales';
import { getMediaRoles, setMediaRoleSearch } from '../../../redux/slices/gplx/gplx.role';
import { updateMediaUserEmailAPI, updateMediaUserInfoAPI, updateMediaUserPhoneAPI, updateMediaUserRoleAPI, updateMediaUserStatusAPI } from '../../../service/gplx/gplx.user.service';
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

const STATUS_OPTION = ['ACTIVE', 'DELETE'];

UserEditForm.propTypes = {
  isEditRole: PropTypes.bool,
  isEditPhone: PropTypes.bool,
  isEditEmail: PropTypes.bool,
  isEditInfo: PropTypes.bool,
  isEditStatus: PropTypes.bool,
  isView: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserEditForm({ isEditRole, isEditEmail, isEditPhone, isEditInfo, isEditStatus, isView, currentUser }) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const dispatch = useDispatch();
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
  const { enqueueSnackbar } = useSnackbar();

  const validateEmail = (email) => (String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ));

  const validatePhone = (phone) => (String(phone)
    .toLowerCase()
    .match(
      /^[+][0-9]{3}[0-9]{4,10}$/
    ));

  const NewAccountSchema = Yup.object().shape({
    displayName: Yup.string().required(translate('validation.required')),
    photoURL: Yup.string().required(translate('validation.required')),
    role: Yup.object().required(translate('validation.required')),
    email: Yup.string().test('required', translate('validation.emailError'), (value) => (!isEditEmail || validateEmail(value))),
    phoneNumber: Yup.string().test('required', translate('validation.phoneError'), (value) => (!isEditPhone || validatePhone(value)))
  });

  const defaultValues = useMemo(
    () => ({
      displayName: currentUser?.displayName || '',
      phoneNumber: currentUser?.phoneNumber || '',
      photoURL: currentUser?.photoURL || '',
      role: currentUser?.role || null,
      email: currentUser?.email || '',
      status: currentUser?.status || STATUS_OPTION[0],
      id: currentUser?.id || ''
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewAccountSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { displayName, photoURL } = watch();

  const onSubmit = async (data) => {
    let resp;

    if (isEditRole)
      resp = await updateMediaUserRoleAPI(data);
    else if (isEditStatus)
      resp = await updateMediaUserStatusAPI(data);
    else if (isEditEmail)
      resp = await updateMediaUserEmailAPI(data);
    else if (isEditPhone)
      resp = await updateMediaUserPhoneAPI(data);
    else if (isEditInfo)
      resp = await updateMediaUserInfoAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.gplx.users);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="displayName" label={translate('media.user.displayName')} disabled={!isEditInfo} />
              <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }} >
                <Avatar alt={displayName} src={photoURL} />
                <RHFTextField name="photoURL" label={translate('media.user.photoURL')} disabled={!isEditInfo} />
              </Stack>
              <RHFTextField name="email" label={translate('media.user.email')} disabled={!isEditEmail} />
              <RHFTextField name="phoneNumber" label={translate('media.user.phoneNumber')} disabled={!isEditPhone} />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>
                <div>
                  <LabelStyle>{translate('media.user.disabled')}</LabelStyle>
                  <RHFRadioGroup
                    name="status"
                    options={STATUS_OPTION}
                    sx={{
                      '& .MuiFormControlLabel-root': { mr: 4 },
                    }}
                    disabled={!isEditStatus} />
                </div>

                <Controller
                  name="role"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      disabled={!isEditRole}
                      {...field}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      options={roles.map(({ id, role }) => ({ id, role }))}
                      getOptionLabel={(option) => option.role}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingRole}
                      onInputChange={(_, value) => {
                        handleFilterRole(value);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.role} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          label={translate('media.user.roles')}
                          {...params}
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
              </Stack>
            </Card>
            {isView ? <Button type='button' size="large" variant="outlined" onClick={() => navigate(-1)}>
              {translate('button.goBack')}
            </Button> :
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {translate('button.save')}
              </LoadingButton>
            }
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
