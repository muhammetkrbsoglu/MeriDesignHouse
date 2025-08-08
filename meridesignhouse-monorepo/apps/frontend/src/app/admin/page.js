import { getUserRoleFromSession, Roles } from '../../../utils/globals';

export default function Admin({ session }) {
  const role = getUserRoleFromSession(session);

  if (role !== Roles.ADMIN) {
    return <h1>Access Denied</h1>;
  }

  return <h1>Admin only page</h1>;
}

