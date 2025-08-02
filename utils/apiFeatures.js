class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // Query parameters from the request
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString }; // Create a copy of the query parameters
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // Fields to exclude
    excludedFields.forEach((el) => delete queryObj[el]); // Remove excluded fields from the query object

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // ⚡️ Replace operators with Regular Expression

    this.query = this.query.find(JSON.parse(queryStr)); // Create a Mongoose query using the modified query string

    return this; // Return the instance for method chaining
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // Convert sort query to a space-separated string
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default sorting by createdAt in descending order
    }
    return this; // Return the instance for method chaining
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' '); // Convert fields query to a space-separated string
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Exclude the __v field by default
    } // id is always included
    return this; // Return the instance for method chaining
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // Convert page query to a number, default to 1
    const limit = this.queryString.limit * 1 || 100; // Convert limit query to a number, default to 100
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    this.query = this.query.skip(skip).limit(limit); // Apply pagination to the query
    return this; // Return the instance for method chaining
  }
}

module.exports = APIFeatures;
