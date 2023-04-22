import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider, RHFEditor, RHFTextField
} from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { createCategoryAPI, updateCategoryAPI } from '../../../service/gplx/gplx.category.service';
import { getSlug } from '../../../utils/urlSlug';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

CategoryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentItem: PropTypes.object,
};


export default function CategoryNewForm({ isEdit, isView, currentItem }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const NewItemSchema = Yup.object().shape({
    title: Yup.string().required(translate('validation.required')),
    description: Yup.string().required(translate('validation.required')),
    orderNo: Yup.number().moreThan(0, translate('validation.positiveNumber')),
    metaDescription: Yup.string().required(translate('validation.required')),
    metaTitle: Yup.string().required(translate('validation.required')),
    slug: Yup.string().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentItem?.title || '',
      description: currentItem?.description || '',
      metaDescription: currentItem?.metaDescription || '',
      metaTitle: currentItem?.metaTitle || '',
      slug: currentItem?.slug || '',
      id: currentItem?.id || '',
      orderNo: currentItem?.orderNo || 0
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
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
    let resp;
    if (isEdit)
      resp = await updateCategoryAPI(data);
    else
      resp = await createCategoryAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(!isEdit ? translate('message.createSuccess') : translate('message.updateSuccess'));
      navigate(PATH_DASHBOARD.gplx.categories);
    } else
      enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });

  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label={translate('gplx.category.title')} disabled={isView} />
              <RHFTextField name="orderNo" label={translate('gplx.category.orderNo')} disabled={isView}
                onChange={(event) => setValue('orderNo', Number(event.target.value), { shouldValidate: true })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  type: 'number',
                }}
              />
              <div>
                <LabelStyle>{translate('gplx.category.description')}</LabelStyle>
                <RHFEditor simple name="description" readOnly={isView} />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <LabelStyle>{translate('label.otherSection')}</LabelStyle>
                <RHFTextField name="metaTitle" label={translate('gplx.category.metaTitle')} disabled={isView} />
                <RHFTextField name="slug" label={translate('gplx.category.slug')} disabled={isView} />
                <RHFTextField name="metaDescription" label={translate('gplx.category.metaDescription')} multiline rows={4} disabled={isView} />
              </Stack>
            </Card>
            {
              isView ? (<Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.gplx.root}/category/${currentItem?.id}/edit`}
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
