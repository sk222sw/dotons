const _ = require("lodash");

const ROLES = {
  ADMIN: "Admin",
  BUSINESS: "Business",
  PRIVATE: "Private",
  PRIVATE_RETAIL: "Private-retail",
  BUSINESS_RETAIL: "Business-retail"
};

exports.roles = ROLES;

exports.getRoleValues = function() {
  const roleList = [];
  _.forOwn(ROLES, (value) => {
    roleList.push(value);
  });
  return roleList;
};
