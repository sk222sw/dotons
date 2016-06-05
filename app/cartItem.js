/**
 * Class representing an item in the shopping cart
 * For easily transfering objects
 */
export default class CartItem {
  /**
   * Instantiates a new instance of the CartItem class
   * @param {string} id - the id of the cart item
   * @param {boolean} ordered10mm - if the 10mm dot has been ordered
   * @param {boolean} ordered11mm - if the 11mm dot has been ordered
   * @param {number} quantity10mm - quantity of the 10mm dots
   * @param {number} quantity11mm - quantity of the 11mm dots
   * @param {number} dotPrice - price of a single dot
   */
  constructor(id, ordered10mm, ordered11mm, quantity10mm, quantity11mm, dotPrice) {
    this.id = id;
    this.ordered10mm = ordered10mm;
    this.ordered11mm = ordered11mm;
    this.quantity11mm = quantity11mm;
    this.quantity10mm = quantity10mm;
    this.dotPrice = dotPrice;  
  } 
  
  /**
   * @return {number} - the total price of the 10mm dots
   */
  get10mmPrice() {
    return this.dotPrice * this.quantity10mm;
  }
  
  /**
   * @return {number} - the total price of the 11mm dots
   */
  get11mmPrice() {
    return this.dotPrice * this.quantity11mm;
  }
}