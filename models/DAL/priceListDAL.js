const PriceList = require("../priceList");

const PriceListDal = {
  getPriceList: () => {
    return PriceList.findOne({}, (err, priceList) => {
      if (err) console.log(err); // todo: handle shit
      console.log(priceList);
    }).exec();
  }
};

module.exports = PriceListDal;
