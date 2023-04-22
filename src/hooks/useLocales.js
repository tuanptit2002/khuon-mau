import { useTranslation } from 'react-i18next';
// '@mui
import { enUS, viVN } from '@mui/material/locale';
import numeral from 'numeral';

// ----------------------------------------------------------------------

const LANGS = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: `${process.env.PUBLIC_URL}/static/icons/ic_flag_us.svg`,
  },
  {
    label: 'Tiếng Việt',
    value: 'vi',
    systemValue: viVN,

    icon: `${process.env.PUBLIC_URL}/static/icons/ic_flag_vi.png`,
  },
];

export default function useLocales() {
  const { i18n, t: translate } = useTranslation();
  const langStorage = localStorage.getItem('i18nextLng');
  const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1];
  numeral.locale(currentLang.value);

  const handleChangeLanguage = (newlang) => {
    i18n.changeLanguage(newlang);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS,
  };
}
