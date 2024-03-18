export default class MarketManager {
    constructor(marketArray) {
        this.list = [];

        if(Array.isArray(marketArray)) {
            marketArray.forEach(object => {
                this.addMarket(object.name, object.basePrice, object.priceMinimum, object.priceMaximum, object.priceInfluence, object.amount, object.neededUpgradeIdentifier);
            })
        }
    }


    addMarket(name="currency", basePrice=50, priceMinimum=10, priceMaximum=100, priceInfluence=5, amount=0, neededUpgradeIdentifier="") {
        this.list.push(new Market(name, basePrice, priceMinimum, priceMaximum, priceInfluence, amount, neededUpgradeIdentifier));
    }


    removeMarketByIndex(marketIndex) {
        // error handling
        if(isNaN(marketIndex) || marketIndex < 0 || marketIndex >= this.list.length) {
            console.warn("invalid marketIndex argument");
            return;
        }
        // remove market
        this.list.splice(marketIndex, 1);
    }

    removeMarketByName(currencyName) {
        // search & remove market
        for(let i=0; i<this.list.length; i++) {
            if(this.list[i].name === currencyName) {
                this.list.splice(i, 1);
                break;
            }
        }
    }


    // Change BasePrice
    changeMarketBasePriceByIndex(marketIndex, newBasePrice) {
        // error handling
        if(isNaN(marketIndex) || marketIndex < 0 || marketIndex >= this.list.length) {
            console.warn("invalid marketIndex argument");
            return;
        }
        if(isNaN(newBasePrice) || newBasePrice < 0) {
            console.warn("invalid newBasePrice argument");
            return;
        }
        // change basePrice
        this.list[marketIndex].basePrice = newBasePrice;
    }

    changeMarketBasePriceByName(currencyName, newBasePrice) {
        // error handling
        if(isNaN(newBasePrice) || newBasePrice < 0) {
            console.warn("invalid newBasePrice argument");
            return;
        }
        // search & change basePrice
        for(let i=0; i<this.list.length; i++) {
            const market = this.list[i];
            if(market.name === currencyName) {
                market.basePrice = newBasePrice;
                break;
            }
        }
    }

    // Change Amount
    changeMarketAmountByIndex(marketIndex, newAmount) {
        // error handling
        if(isNaN(marketIndex) || marketIndex < 0 || marketIndex >= this.list.length) {
            console.warn("invalid marketIndex argument");
            return;
        }
        if(isNaN(newAmount) || newAmount < 0) {
            console.warn("invalid newAmount argument");
            return;
        }
        // change amount
        this.list[marketIndex].amount = newAmount;
    }
    
    changeMarketAmountByName(currencyName, newAmount) {
        // error handling
        if(isNaN(newAmount) || newAmount < 0) {
            console.warn("invalid newAmount argument");
            return;
        }
        // search & change amount
        for(let i=0; i<this.list.length; i++) {
            const market = this.list[i];
            if(market.name === currencyName) {
                market.amount = newAmount;
                break;
            }
        }
    }


    // Get Market
    getMarketByIndex(marketIndex) {
        // error handling
        if(isNaN(marketIndex) || marketIndex < 0 || marketIndex >= this.list.length) {
            console.warn("invalid marketIndex argument");
            return;
        }
        // return market
        return this.list[marketIndex];
    }

    getMarketByName(currencyName) {
        // search & return market
        for(let i=0; i<this.list.length; i++) {
            if(this.list[i].name === currencyName) {
                return this.list[i];
            }
        }
    }

}



class Market {
    constructor(name="currency", basePrice=50, priceMinimum=10, priceMaximum=100, priceInfluence=5, amount=0, neededUpgradeIdentifier="") {
        this.name = name;
        this.basePrice = basePrice;
        this.priceMinimum = priceMinimum;
        this.priceMaximum = priceMaximum;
        this.priceInfluence = priceInfluence;
        this.amount = amount;
        this.neededUpgradeIdentifier = neededUpgradeIdentifier;
    }
}



// TESTING, TEMPORARY
/* const marketManager = new MarketManager([{name:"oofers"}, {name:"oofarz", priceInfluence:27}]);
marketManager.addMarket();
marketManager.addMarket("test", 10, 1, 30, 5);

marketManager.changeMarketBasePriceByName("currency", 999);
marketManager.changeMarketBasePriceByIndex(1, 420);

marketManager.changeMarketAmountByName("currency", 69);
marketManager.changeMarketAmountByIndex(1, 696969);

marketManager.removeMarketByIndex(0);

console.log(marketManager);
console.log(marketManager.getMarketByIndex(1));
console.log(marketManager.getMarketByName("currency")); */
