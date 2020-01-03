const handleNotFound = async (req, res) => {
  res
    .status(404)
    .json({ data: null, included: null, code: 404 });
};

export default handleNotFound;
