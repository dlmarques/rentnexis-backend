const LEASE_STATUS_TYPE = {
  false: 0,
  true: 1,
};

const LEASE_STATUS_KEY = {
  false: "NOT_ACTIVE",
  true: "ACTIVE",
};

const LEASE_STATUS = { LEASE_STATUS_KEY, LEASE_STATUS_TYPE };

module.exports = LEASE_STATUS;
