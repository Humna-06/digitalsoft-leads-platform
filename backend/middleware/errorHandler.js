function errorHandler(err, req, res, next) {
  console.error("ERROR:", err.message);
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value entered",
      field: Object.keys(err.keyValue)[0]
    });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
module.exports = {
  errorHandler,
  asyncHandler
};
