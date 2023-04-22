function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  gplx: {
    root: path(ROOTS_DASHBOARD, '/gplx'),

    newRole: path(ROOTS_DASHBOARD, '/gplx/role/new'),
    roles: path(ROOTS_DASHBOARD, '/gplx/roles'),

    newCategory: path(ROOTS_DASHBOARD, '/gplx/category/new'),
    categories: path(ROOTS_DASHBOARD, '/gplx/categories'),

    newExam: path(ROOTS_DASHBOARD, '/gplx/exam/new'),
    exams: path(ROOTS_DASHBOARD, '/gplx/exams'),

    newSituation: path(ROOTS_DASHBOARD, '/gplx/situation/new'),
    situations: path(ROOTS_DASHBOARD, '/gplx/situations'),

    newPrivilege: path(ROOTS_DASHBOARD, '/gplx/privilege/new'),
    privileges: path(ROOTS_DASHBOARD, '/gplx/privileges'),

    users: path(ROOTS_DASHBOARD, '/gplx/users'),

    caches: path(ROOTS_DASHBOARD, '/gplx/caches'),
  },
  dashboard: {
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
  },
};

// export const PATH_DOCS = 'https://onthibanglaixe.net';
// export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';