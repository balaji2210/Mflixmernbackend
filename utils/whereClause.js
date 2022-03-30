class WhereClause {
  constructor(bigQ, query) {
    this.bigQ = bigQ;
    this.query = query;
  }

  search() {
    const search = this.query.search
      ? {
          title: {
            $regex: this.query.search,
            $options: "i",
          },
        }
      : {};
    this.bigQ = this.bigQ.find({ ...search });
    return this;
  }
}
