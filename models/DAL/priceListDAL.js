const PriceList = require("../priceList");

const PriceListDal = {
  /**
   * Gets the pricelist for the dot designs
   * Includes prices for all different accounts
   * 
   * @returns {PriceList}
   */
  getPriceList: () => {
    return PriceList.findOne({}, (err, priceList) => {
      if (err) console.log(err); // todo: handle shit
      console.log(priceList);
    }).exec();
  }
};

module.exports = PriceListDal;
