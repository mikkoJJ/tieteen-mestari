/*=======================================================================
 * Tieteen Mestari
 * ---------------
 * 
 * units.js
 * --------
 * File containing the "class" definitions for different types
 * of game units.
 *======================================================================*/

/**
 * An object for keeping track of the different kinds of in-game
 * resources for the university. 
 */
function Resources (gold, international, localpapers) {
    this.gold = gold ? gold : 0;
    this.inter = international ? international : 0;
    this.local = localpapers ? localpapers : 0;
    
    /**
     * Subtracts other resources from this resource object.
     * @param {Resources} other the resource object to subtract from this  
     * @return {Resources} a new object containing the subtracted amount
     */
    this.subtract = function (other) {
        return new Resources(this.gold - other.gold, this.inter - other.inter, this.local - other.local);
    };
   
    /**
     * Adds another resource object to this one.
     * @param {Resources} other the resource object to add to this.  
     * @return {Resources} a new object containing the added amount.
     */
    this.add = function (other) {
        return new Resources(this.gold + other.gold, this.inter + other.inter, this.local + other.local);
    };
    
    /**
     * Adds a specified amount to the given resource.
     * @param {String} resource the name of the resource to add
     * @param {Float} amount the amount to add. 
     */
    this.addTo = function(resource, amount) {
        this[resource] += amount;  
    };
    
    /**
     * Subtracts a specified amount from the given resource.
     * @param {String} resource the name of the resource to subtract
     * @param {Float} amount the amount to subtract. 
     */
    this.subtractFrom = function(resource, amount) {
        this[resource] -= amount;  
    };
    
    /**
     * Gets the value of the given resource.
     * @param {String} resource the name of the resource to get
     * @return {Float} the value of the resource 
     */
    this.get = function(resource) {
        return this[resource];
    };
    
    /**
     * Sets a given resource to a desired amount.
     * @param {String} resource the name of the resource to set
     * @param {Float} value the value to set to
     */
    this.set = function(resource, value) {
        this[resource] = value;
    };
}

/**
 * A game unit that can be hired to the university.
 * Affects upkeep and income of resources in different ways. 
 */
function Unit (baseGold, baseInternational, baseLocal) {
    
    var baseUpkeep = new Resources(baseGold, baseInternational, baseLocal);
    var baseIncome = new Resources();
    
    /**
     * @return {Object} the upkeep cost of different resources for this unit.
     */
    this.getUpkeep = function() {
        return baseUpkeep;
    };
    
    this.getIncome = function() {
        return baseIncome;  
    };
}


/**
 * Enters the university and tries to graduate. 
 */
function Student () {
    
    //when progress gets to 1, the student graduates
    this._progress = 0.0;
    
    this._morale = Math.random() * (1.0 - 0.01) + 0.01;
    
    
    /**
     * Try to progress studies, success based on morale. 
     */
    this.study = function() {
        var baseProgress = 0.1;
        this._progress += baseProgress * this._morale;
        console.log(this); 
    };
    
    /**
     *  
     */
    this.canGraduate = function() {
        return this._progress >= 1.0;
    };
    
    /**
     * Gets the progress of studies for this student.
     * @return {float} number between 0 and 1 representing the progress of studies to graduation 
     */
    this.getProgress = function() {
        return this._progress;
    };
    
}
