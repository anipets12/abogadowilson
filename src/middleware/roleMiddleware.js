const checkRole = (allowedRoles) => async (request) => {
  const user = await authMiddleware(request);
  
  if (!user) {
    return {
      success: false,
      status: 401,
      message: 'No autorizado'
    };
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      success: false,
      status: 403,
      message: 'Acceso denegado'
    };
  }

  return {
    success: true,
    user
  };
};

module.exports = { checkRole };
