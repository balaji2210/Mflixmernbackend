class WhereClause {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const search = this.queryStr.search
      ? {
          title: {
            $regex: this.queryStr.search,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...search });
    return this;
  }
}

module.exports = WhereClause;
