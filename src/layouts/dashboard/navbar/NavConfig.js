// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------
const getIcon = (name) => (
  <SvgIconStyle src={`${process.env.PUBLIC_URL}/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
const ICONS = {
  cache: getIcon('ic_cache'),
  video: getIcon('ic_booking'),
  user: getIcon('ic_user'),
  analytics: getIcon('ic_dashboard'),
};
const navConfig = [
  // GENERAL
  {
    subheader: 'menu.general',
    items: [
      {
        title: 'menu.analytics',
        path: PATH_DASHBOARD.dashboard.analytics, icon: ICONS.analytics,
        hasRoles: ["ROLE_ADMIN", 'ROLE_MANAGER', 'ROLE_EDITOR']
      }
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'menu.gplx',
    items: [
      {
        title: 'menu.situation',
        path: PATH_DASHBOARD.gplx.situations,
        icon: ICONS.video,
        hasRoles: ["ROLE_ADMIN"],
        children: [
          { title: 'menu.situation', path: PATH_DASHBOARD.gplx.situations },
          { title: 'menu.exam', path: PATH_DASHBOARD.gplx.exams },
          { title: 'menu.category', path: PATH_DASHBOARD.gplx.categories },
        ],
      },
      {
        title: 'menu.user',
        path: PATH_DASHBOARD.gplx.users,
        icon: ICONS.user,
        hasRoles: ["ROLE_ADMIN"],
        children: [
          { title: 'menu.user', path: PATH_DASHBOARD.gplx.users },
          { title: 'menu.privilege', path: PATH_DASHBOARD.gplx.privileges },
          { title: 'menu.role', path: PATH_DASHBOARD.gplx.roles },
        ],
      },
      {
        title: 'menu.cache',
        path: PATH_DASHBOARD.gplx.caches,
        icon: ICONS.cache,
        hasRoles: ["ROLE_ADMIN"],
        children: [
          { title: 'menu.cache', path: PATH_DASHBOARD.gplx.caches },
        ],
      }
    ],
  },
];
export default navConfig;
