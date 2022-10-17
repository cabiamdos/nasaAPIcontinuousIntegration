// if we pass 0 as the page limit, mongo will return all the documents in the collection.
const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;
const getPagination = (query) => {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit
  };
}

module.exports = {
  getPagination
}