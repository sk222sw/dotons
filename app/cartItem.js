export default class CartItem {
  constructor(id, ordered10mm, ordered11mm, quantity10mm, quantity11mm, dotPrice) {
    this.id = id;
    this.ordered10mm = ordered10mm;
    this.ordered11mm = ordered11mm;
    this.quantity11mm = quantity11mm;
    this.quantity10mm = quantity11mm;
    this.dotPrice = dotPrice;  
  } 
  
  get10mmPrice() {
    return this.dotPrice * this.quantity10mm;
  }
  
  get11mmPrice() {
    return this.dotPrice * this.quantity11mm;
  }
}