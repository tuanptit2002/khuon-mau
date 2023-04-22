import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Card, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
// routes
import useLocales from '../../../hooks/useLocales';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { getGPLXSituations, setGPLXSituationSearch } from '../../../redux/slices/gplx/gplx.situation';
import { createExamSituationAPI } from '../../../service/gplx/gplx.examSituation.service';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ExamSituationNewForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentRole: PropTypes.object,
};


export default function ExamSituationNewForm({ exam, refresh }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const { situations, search, isLoading: isLoadingExamSituation } = useSelector((state) => state.situation);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getGPLXSituations());
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleFilterExamByTitle = (value) => {
    dispatch(setGPLXSituationSearch({ ...search, value }));
  };

  const NewItemSchema = Yup.object().shape({
    orderNo: Yup.number().moreThan(0, translate('validation.positiveNumber')),
    exam: Yup.object().nullable().required(translate('validation.required')),
  });

  const defaultValues = useMemo(
    () => ({
      orderNo: 0,
      exam: { id: exam?.id },
      situation: null,
      id: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const { reset, setValue, control, handleSubmit, formState: { isSubmitting }, } = methods;

  const onSubmit = async (data) => {
    const resp = await createExamSituationAPI(data);

    if (resp.code === '200') {
      reset();
      enqueueSnackbar(translate('message.createSuccess'));
      refresh();
    } else enqueueSnackbar(`${resp.code} - ${resp.message}`, { variant: 'error' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} >
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} alignItems="center" >
              <Controller
                name="situation"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={situations?.map(({ id, title }) => ({ id, title }))}
                    getOptionLabel={(option) => option.title || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    loading={isLoadingExamSituation}
                    onInputChange={(event, value) => {
                      handleFilterExamByTitle(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.title} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label={translate('gplx.examSituation.situation')}
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />

              <RHFTextField name="orderNo" label={translate('gplx.examSituation.orderNo')}
                onChange={(event) => setValue('orderNo', Number(event.target.value), { shouldValidate: true })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  type: 'number',
                }}
              />

              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting} sx={{ minWidth: 200 }}>
                {translate('button.new')}
              </LoadingButton>

            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider >
  );
}
