export default class Upgrade {
    constructor(name="Upgrade-name", basePrice=10, priceMultiplier=2.0, maxLevel=99) {
        this.name = name;
        this.basePrice = basePrice;
        this.priceMultiplier = priceMultiplier;
        this.maxLevel = maxLevel;

        this.currentLevel = 0;
        this.isMaxed = false;
    }
  
    getName() {return this.name}
    getBasePrice() {return this.basePrice}
    getPriceMultiplier() {return this.priceMultiplier}
    getCurrentLevel() {return this.currentLevel}
    getMaxLevel() {return this.maxLevel}
    getIsMaxed() {return this.isMaxed}
  
    setCurrentLevel(level) {this.currentLevel = isNaN(level) ? this.currentLevel : level}
    setIsMaxed(bool) {this.isMaxed = bool}
  
    levelUp(amount=1) {
        const clamped = Math.min(Math.max(this.getCurrentLevel() + amount, 0), this.getMaxLevel());

        this.setCurrentLevel(clamped);
        this.setIsMaxed(this.getCurrentLevel() >= this.getMaxLevel())
    }
  
    calculatePrice() {
        const price = this.getBasePrice() * Math.pow(this.getPriceMultiplier(), this.getCurrentLevel());
        return Math.floor(price);
    }
  }