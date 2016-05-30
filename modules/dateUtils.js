const sortCollectionByDate = (collection) => {
  return collection.sort((a, b) => {
    return new Date(b.orderDate) - new Date(a.orderDate);
  });
};

const formatCollectionDates = (collection) => {
  return collection.map(item => {
    item.orderDate = new Date(item.orderDate).toISOString().slice(0, 10);
    return item;
  }); 
};

module.exports = {
  sortCollectionByDate,
  formatCollectionDates
};