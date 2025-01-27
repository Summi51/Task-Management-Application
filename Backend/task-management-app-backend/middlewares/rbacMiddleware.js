const rbac = (roles) => {
    return (req, res, next) => {
      const userRole = req.userRole; 
      console.log(userRole, 'userRole++')
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
  };
  
  module.exports = rbac;
  