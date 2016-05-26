const PriceList = require("../priceList");

const PriceListDal = {
  /**
   * Gets the pricelist for the dot designs
   * Includes prices for all different accounts
   * 
   * @returns {PriceList}
   */
  getPriceList: () => {
    return PriceList.findOne({}).exec();
  }
};

module.exports = PriceListDal;
