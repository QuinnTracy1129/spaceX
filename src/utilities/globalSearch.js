const globalSearch = (collection, searchKey) =>
  collection.filter(item => {
    for (const key in item) {
      if (String(item[key]).toUpperCase().includes(searchKey)) {
        return true;
      }
    }

    // if (type === "object") {
    //   let nestedResults = globalSearch(Object.values(item), key);
    //   return nestedResults.length > 0;
    // } else if (type === "string" && item.toUpperCase().includes(key)) {
    //   return true;
    // }
    return false;
  });

export default globalSearch;
