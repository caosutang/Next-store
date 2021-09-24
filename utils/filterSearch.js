const filterSearch = ({ router, page, category, sort, search }) => {
  const path = router.pathname;
  const query = router.query;
  if (category) query.category = category;
  if (sort) query.sort = sort;
  if (search) query.search = search;
  if (page) query.page = page;

  router.push({
    pathname: path,
    query: query,
  });
};

export default filterSearch;
