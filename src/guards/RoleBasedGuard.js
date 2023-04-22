import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from '../hooks/useAuth';
import useLocales from '../hooks/useLocales';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['ROLE_ADMIN', 'ROLE_EDITOR','ROLE_MANAGER']
  children: PropTypes.node
};

const useCurrentRole = () => {
  const { user } = useAuth();
  const { role } = user
  return role.role;
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const currentRole = useCurrentRole();
  const { translate } = useLocales()

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>{translate("message.permissionDeny")}</AlertTitle>
          {translate("message.permissionDenyDescription")}
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
