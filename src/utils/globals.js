const Roles = {
  ADMIN: "admin",
  USER: "user",
};

function getUserRoleFromSession(session) {
  if (
    session &&
    session.metadata &&
    (session.metadata.role === Roles.ADMIN ||
     session.metadata.role === Roles.USER)
  ) {
    return session.metadata.role;
  }
  return null;
}

module.exports = {
  Roles,
  getUserRoleFromSession,
};
