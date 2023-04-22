/* eslint-disable react/prop-types */
import { useSnackbar } from 'notistack';
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
// routes
import { useDispatch, useSelector } from 'react-redux';
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider, RHFEditor, RHFRadioGroup, RHFTextField
} from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { getCategories, setCategorySearch } from '../../../redux/slices/gplx/gplx.category';
import { updateGPLXSituationAPI } from '../../../service/gplx/gplx.situation.service';
import { getSlug } from '../../../utils/urlSlug';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const STATUS_OPTION = ['DRAFT', 'PROCESS', 'ACTIVE', 'FAILED'];

export default function SituationEditForm({ isEdit, isView, currentItem }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { categories, search: searchCategory, isLoading: isLoadingCategory, } = useSelector((state) => state.category);

  const NewItemSchema = Yup.object().shape({
    duration: Yup.number().min(0, translate('validation.positiveNumber')),
    title: Yup.string().required(translate('validation.required')),
    status: Yup.string().required(translate('validation.required')),
    description: Yup.string().required(translate('validation.required')),
    metaTitle: Yup.string().required(translate('validation.required')),
    metaDescription: Yup.string().required(translate('validation.required')),
    slug: Yup.string().required(translate('validation.required')),
    start: Yup.number().moreThan(0, translate('validation.positiveNumber')),
    end: Yup.number().moreThan(0, translate('validation.positiveNumber')),
    category: Yup.object().nullable().required(translate('validation.required')),
    orderNo: Yup.number().moreThan(0, translate('validation.positiveNumber')),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentItem?.id || '',
      title: currentItem?.title || '',
      duration: currentItem?.duration || 0,
      status: currentItem?.status || STATUS_OPTION[0],
      category: currentItem?.category || null,
      description: currentItem?.description || '',
      metaDescription: currentItem?.metaDescription || '',
      metaTitle: currentItem?.metaTitle || '',
      slug: currentItem?.slug || '',
      start: currentItem?.start || 0,
      end: currentItem?.end || 0,
      orderNo: currentItem?.orderNo || 0
    }),
    [currentItem]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getCategories());
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchCategory]);// eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterTitleCategory = (value) => {
    dispatch(setCategorySearch({ ...searchCategory, value }));
  };

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue("metaTitle", value.title, { shouldValidate: true });
        setValue("slug", getSlug(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data) => {
    const resp = await updateGPLXSituationAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.gplx.situations);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label={translate('gplx.situation.title')} disabled={isView} />
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete fullWidth disabled={isView}
                    {...field}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    options={categories?.map(({ id, title }) => ({ id, title }))}
                    getOptionLabel={(option) => option.title || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    loading={isLoadingCategory}
                    onInputChange={(_, value) => {
                      handleFilterTitleCategory(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.title} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label={translate('gplx.situation.category')}
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <div>
                <LabelStyle>{translate('gplx.situation.description')}</LabelStyle>
                <RHFEditor simple name="description" readOnly={isView} />
              </div>


              <div>
                <LabelStyle>{translate('gplx.situation.status')}</LabelStyle>
                <RHFRadioGroup
                  name="status"
                  options={STATUS_OPTION}
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 4 },
                  }}
                  disabled={isView} />
              </div>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>
                <RHFTextField name="orderNo" label={translate('gplx.situation.orderNo')} disabled={isView}
                  onChange={(event) => setValue('orderNo', Number(event.target.value), { shouldValidate: true })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField name="duration" label={translate('gplx.situation.duration')} disabled={isView}
                  onChange={(event) => setValue('duration', Number(event.target.value), { shouldValidate: true })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField name="start" label={translate('gplx.situation.start')} disabled={isView}
                  onChange={(event) => setValue('start', Number(event.target.value), { shouldValidate: true })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField name="end" label={translate('gplx.situation.end')} disabled={isView}
                  onChange={(event) => setValue('end', Number(event.target.value), { shouldValidate: true })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField name="metaTitle" label={translate('gplx.situation.metaTitle')} disabled={isView} />
                <RHFTextField name="slug" label={translate('gplx.situation.slug')} disabled={isView} />
                <RHFTextField name="metaDescription" label={translate('gplx.situation.metaDescription')} multiline rows={4} disabled={isView} />
              </Stack>
            </Card>
            {
              isView ? (<Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.gplx.root}/situation/${currentItem?.id}/edit`}
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
};
