export default class UpgradeList {
    constructor(upgradeArray) {
        this.list = [];
        this.setList(upgradeArray);
    }


    getList(index) {
        if(index===undefined) return this.list;
        if(index < 0 || index >= this.list.length || isNaN(index)) {
            console.warn("Invalid index, returning empty array");
            return [];
        }
        else {
            return this.list[index];
        }
    }

    getByIdentifier(upgradeIdentifier) {
        if(!Array.isArray(this.list)) return;

        for(let i=0; i<this.getList().length; i++) {
            if(this.getList(i).identifier === upgradeIdentifier) {
                return this.getList(i);
            }
        }
    }


    setList(upgradeArray) {
        this.list = Array.isArray(upgradeArray) ? [... upgradeArray] : [... this.list];
    }
}


export class Upgrade {
    constructor(identifier="", name="Upgrade-name", basePrice=10, priceMultiplier=2.0, maxLevel=99) {
        this.identifier = identifier;
        this.name = name;
        this.basePrice = basePrice;
        this.priceMultiplier = priceMultiplier;
        this.maxLevel = maxLevel;

        this.currentLevel = 0;
        this.isMaxed = false;
    }
  
    getIdentifier() {return this.identifier}
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