const paginationInfo = (data, start, count, totalCount) => {

  const nextPage = start + count;
  const pagingInfo = {
    data,
    paging: {
      totalCount: totalCount,
      currentDataCount: data.length,
      start,
      nextPage: totalCount > nextPage ? nextPage : undefined
    }
  }
  return pagingInfo
}

module.exports = { paginationInfo };
