import _ from "lodash";

const paginateData = (records, { count, currentPage, pageSize = 100 } = {}) => {
  count = count || records.length;

  const paginatedData = _.clone(records);
  const totalPages = Math.ceil(count / pageSize);
  const current = currentPage || totalPages;
  const next = current === totalPages ? null : current + 1;

  paginatedData.meta = {
    pagination: { count, current, next, per_page: pageSize }
  };

  return paginatedData;
};

export default paginateData;
