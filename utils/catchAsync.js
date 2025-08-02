// Catch any errors in the async function and pass them to the next middleware
module.exports =
  (fn) =>
  // ❗️返回一个新的异步函数 (Higher-order function to handle async errors)
  (req, res, next) => {
    // ✅ 执行原始的异步函数，并捕获任何 Promise rejection
    fn(req, res, next).catch((err) => next(err));
  };

/*
Example:
  do not use try-catch block in each controller function
  instead, wrap the controller function with catchAsync utility

❌
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated fields
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour, // Return the updated tour
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err, // Send the error message in the response
    });
  }
};

✅ 
exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Run validation on the updated fields
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour, // Return the updated tour
    },
  });
});
*/
