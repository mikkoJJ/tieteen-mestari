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


//============================================================================ UNIT

/**
 * A game unit that can be hired to the university.
 * Affects upkeep and income of resources in different ways.
 * @class Unit 
 */
var Unit = function() {
    this.initialize();
};

/**
 * Initialize the Unit with default values. 
 */
Unit.prototype.initialize = function() {
    this._baseUpkeep = 0;
    this._baseProgress = 0.1;
    this._progress = 0.0;
    this._yieldType = "undefined";
    this._yieldAmount = 1;
    this._continuous = true;
    this._morale = Math.random() * (1.0 - 0.4) + 0.4;
};

/**
 * @return {Object} the upkeep cost in gold for this unit.
 */
Unit.prototype.getUpkeep = function() {
    return this._baseUpkeep;
};

/**
 * Gets the progress of studies for this student.
 * @return {float} number between 0 and 1 representing the progress of studies to graduation 
 */
Unit.prototype.getProgress = function() {
    return this._progress;
};

Unit.prototype.boostMorale = function(amount) {
    this._morale *= amount;
};

/**
 * Updates the unit's progress in doing the thing it's doing 
 * @param {Object} deltaTime current time in seconds between updates
 */
Unit.prototype.update = function(deltaTime) {
    this._progress += this._baseProgress * this._morale * deltaTime; 
};

/**
 * @return {Boolean} true if the progress of this unit is done.
 */
Unit.prototype.isDone = function() {
    return this._progress >= 1.0;
};

/**
 * Restarts this unit's progress. 
 */
Unit.prototype.restart = function() {
    this._progress = 0.0;  
};

/**
 * @return {Object} an object containing the resource type and amount this unit yields. 
 */
Unit.prototype.yield = function() {
    return {type: this._yieldType, amount: this._yieldAmount};  
};

/**
 * @return {Boolean} true if this unit is set to continuous mode, ie. it doesn't disappear
 * after it yields. 
 */
Unit.prototype.isContinuous = function() {
    return this._continuous;
};

/**
 * @return {Boolean} true if this unit is a student and not staff. 
 */
Unit.prototype.isStudent = function() {
    return this._yieldType == "graduates";
};

Unit.prototype.onAdd = function(logic) { };

//============================================================================================= STUDENT

var Student = function() {
    this.initialize();
    
    this._baseUpkeep = 0.1;
    this._baseProgress = 1 / 60 / 4;
    this._yieldType = "graduates";
    this._continuous = false;
    this.sprite = "student";
};

Student.prototype = new Unit();


//============================================================================================= RESEARCHER

var Researcher = function() {
    this.initialize();
    
    this._baseUpkeep = 3;
    this._yieldType = "research";
    this.sprite = "researcher";
};

Researcher.prototype = new Unit();


//============================================================================================= TEACHER

var Teacher = function() {
    this.initialize();
    
    this._baseUpkeep = 1;
    this._baseProgress = 0;
    this._yieldType = "research";
    this.sprite = "teacher";
};

Teacher.prototype = new Unit();

Teacher.prototype.onAdd = function(logic) {
    var units = logic.getUnits();
    for(var i=0; i<units.length; i++) {
        var unit = units[i];
        if(unit.isStudent() && !unit.teacher) {
            unit.teacher = this;
            unit.boostMorale(2);
        }
    }  
};
