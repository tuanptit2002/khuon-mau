/* eslint-disable react/prop-types */
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Card, Chip, FormHelperText, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { UploadSingleFile } from '../../../components/upload';

import useLocales from '../../../hooks/useLocales';
import { getCategories, setCategorySearch } from '../../../redux/slices/gplx/gplx.category';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { createGPLXSituationAPI } from '../../../service/gplx/gplx.situation.service';
// components
import {
  FormProvider, RHFEditor, RHFTextField
} from '../../../components/hook-form';
import { getFileName } from '../../../utils/getFileFormat';
import { getSlug } from '../../../utils/urlSlug';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function SituationNewForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const { categories, search: searchCategory, isLoading: isLoadingCategory, } = useSelector((state) => state.category);

  const NewItemSchema = Yup.object().shape({
    title: Yup.string().required(translate('validation.required')),
    category: Yup.object().nullable().required(translate('validation.required')),
    fileObj: Yup.mixed().required(translate('validation.required')),
    metaDescription: Yup.string().required(translate('validation.required')),
    metaTitle: Yup.string().required(translate('validation.required')),
    slug: Yup.string().required(translate('validation.required')),
    description: Yup.string().required(translate('validation.required')),
    start: Yup.number().moreThan(0, translate('validation.positiveNumber')),
    end: Yup.number().moreThan(0, translate('validation.positiveNumber')),
    orderNo: Yup.number().moreThan(0, translate('validation.positiveNumber')),
  });

  const defaultValues = useMemo(
    () => ({
      title: '',
      fileObj: null,
      category: null,
      description: '',
      metaDescription: '',
      metaTitle: '',
      slug: '',
      start: 0,
      end: 0,
      orderNo: 0
    }),
    []
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
    const resp = await createGPLXSituationAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.createSuccess'));
      navigate(PATH_DASHBOARD.gplx.situations);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue('fileObj', Object.assign(file, { preview: URL.createObjectURL(file), }));
        setValue('title', getFileName(file.name), { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <div>
                <LabelStyle>{translate('gplx.situation.filename')}</LabelStyle>
                <Controller
                  name="fileObj"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    const checkError = !!error && !field.value;
                    return (
                      <UploadSingleFile
                        accept="video/*"
                        file={field.value}
                        error={checkError}
                        helperText={
                          checkError && (
                            <FormHelperText error sx={{ px: 2 }}>
                              {error.message}
                            </FormHelperText>
                          )
                        }
                        onDrop={handleDrop}
                      />
                    );
                  }}
                />
              </div>
              <RHFTextField name="title" label={translate('gplx.situation.title')} />
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={categories?.map(({ id, title }) => ({ id, title }))}
                    getOptionLabel={(option) => option.title || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    loading={isLoadingCategory}
                    onInputChange={(event, value) => {
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
                <RHFEditor simple name="description" />
              </div>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>

                <RHFTextField name="orderNo" label={translate('gplx.situation.orderNo')}
                  onChange={(event) => setValue('orderNo', Number(event.target.value), { shouldValidate: true })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField name="start" label={translate('gplx.situation.start')}
                  onChange={(event) => setValue('start', Number(event.target.value), { shouldValidate: true })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField name="end" label={translate('gplx.situation.end')}
                  onChange={(event) => setValue('end', Number(event.target.value), { shouldValidate: true })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField name="metaTitle" label={translate('gplx.situation.metaTitle')} />
                <RHFTextField name="slug" label={translate('gplx.situation.slug')} />
                <RHFTextField name="metaDescription" label={translate('gplx.situation.metaDescription')} multiline rows={4} />
              </Stack>
            </Card>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {translate('button.new')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>

  );
}
