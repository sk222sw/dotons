const PriceList = require("../priceList");

const PriceListDal = {
  /**
   * Gets the pricelist for the dot designs
   * Includes prices for all different accounts
   * 
   * @returns {Promise} - resolves if the pricelist was found
   */
  getPriceList: () => {
    return PriceList.findOne({}).exec();
  }
};

module.exports = PriceListDal;
