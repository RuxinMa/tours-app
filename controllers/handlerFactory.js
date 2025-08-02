const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// Factory function: Delete a document by ID
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null, // No content to return
    }); // 204 No Content, no body in the response
  });

// Factory function: Update a document by ID
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated fields
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc, // Return the updated tour
      },
    });
  });

// Factory function: Create a new document
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// Factory function: Get a document
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions); // Populate the specified fields if provided

    const doc = await query; // Find the tour by ID and populate the reviews field

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log('query:', req.query); // Log the query parameters

    // 0️⃣ To allow for nested reviews on tour
    // If tourId is provided in the URL, filter reviews by tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // 1️⃣ BUILD QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(); // Create an instance of APIFeatures and chain the methods

    // 2️⃣ EXECUTE QUERY
    const docs = await features.query;

    // 3️⃣ SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs, // tours: tours
      },
    });
  });
