import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// ----------------------------------------------------------------------
const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed',
            }),
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

// media
const SituationList = Loadable(lazy(() => import('../pages/gplx/situation/SituationList')));
const SituationCreate = Loadable(lazy(() => import('../pages/gplx/situation/SituationCreate')));
const MediaRoleCreate = Loadable(lazy(() => import('../pages/gplx/role/MediaRoleCreate')));
const MediaRoleList = Loadable(lazy(() => import('../pages/gplx/role/MediaRoleList')));
const CategoryCreate = Loadable(lazy(() => import('../pages/gplx/category/CategoryCreate')));
const CategoryList = Loadable(lazy(() => import('../pages/gplx/category/CategoryList')));
const ExamCreate = Loadable(lazy(() => import('../pages/gplx/exam/ExamCreate')));
const ExamList = Loadable(lazy(() => import('../pages/gplx/exam/ExamList')));
const MediaPrivilegeCreate = Loadable(lazy(() => import('../pages/gplx/privilege/MediaPrivilegeCreate')));
const MediaPrivilegeList = Loadable(lazy(() => import('../pages/gplx/privilege/MediaPrivilegeList')));
const UserList = Loadable(lazy(() => import('../pages/gplx/user/MediaUserList')));
const UserEdit = Loadable(lazy(() => import('../pages/gplx/user/MediaUserEdit')));
const MediaCacheList = Loadable(lazy(() => import('../pages/gplx/cache/MediaCacheList')));
const MediaCacheKeyList = Loadable(lazy(() => import('../pages/gplx/cache/MediaCacheKeyList')));

const gplxRoute = {
  path: 'gplx',
  element: (
    <RoleBasedGuard accessibleRoles={['ROLE_ADMIN']}>
      <Outlet />
    </RoleBasedGuard>
  ),
  children: [
    { element: <Navigate to="/dashboard/gplx/situations" replace />, index: true },

    // situation
    { path: 'situation/new', element: <SituationCreate /> },
    { path: 'situations', element: <SituationList /> },
    { path: 'situation/:id/edit', element: <SituationCreate /> },
    { path: 'situation/:id/view', element: <SituationCreate /> },

    // category
    { path: 'category/new', element: <CategoryCreate /> },
    { path: 'categories', element: <CategoryList /> },
    { path: 'category/:id/edit', element: <CategoryCreate /> },
    { path: 'category/:id/view', element: <CategoryCreate /> },

    // exam
    { path: 'exam/new', element: <ExamCreate /> },
    { path: 'exams', element: <ExamList /> },
    { path: 'exam/:id/edit', element: <ExamCreate /> },
    { path: 'exam/:id/view', element: <ExamCreate /> },

    // role
    { path: 'role/new', element: <MediaRoleCreate /> },
    { path: 'roles', element: <MediaRoleList /> },
    { path: 'role/:id/edit', element: <MediaRoleCreate /> },
    { path: 'role/:id/view', element: <MediaRoleCreate /> },

    // privilege
    { path: 'privilege/new', element: <MediaPrivilegeCreate /> },
    { path: 'privileges', element: <MediaPrivilegeList /> },
    { path: 'privilege/:id/edit', element: <MediaPrivilegeCreate /> },
    { path: 'privilege/:id/view', element: <MediaPrivilegeCreate /> },

    // user
    { path: 'users', element: <UserList /> },
    { path: 'user/:id/view', element: <UserEdit /> },
    { path: 'user/:id/edit/role', element: <UserEdit /> },
    { path: 'user/:id/edit/email', element: <UserEdit /> },
    { path: 'user/:id/edit/phone', element: <UserEdit /> },
    { path: 'user/:id/edit/status', element: <UserEdit /> },
    { path: 'user/:id/edit/uid', element: <UserEdit /> },
    { path: 'user/:id/edit/info', element: <UserEdit /> },

    // cache
    { path: 'caches', element: <MediaCacheList /> },
    { path: 'cache/:name/keys', element: <MediaCacheKeyList /> },
  ],
};

export default gplxRoute;
