const admin_auth = (req, res) => {
  const token = "xyz";
  const isAdmin = token === "xyz";
  if (isAdmin) {
    res.send("All Data");
  } else {
    res.status(401).send("Unauthorized access");
  }
};

module.exports = { admin_auth };
