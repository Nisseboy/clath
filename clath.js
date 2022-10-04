class clath {
  constructor(dbUpsert, dbFetch) {
    this.dbUpsert = dbUpsert;
    this.dbFetch = dbFetch;
  }

  async create(username, password) {
    let user = await this.dbFetch();
    if (user) return {res: null, err: "User already exists"}

    
  }
}