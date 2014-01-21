/*=======================================================================
 * Tieteen Mestari
 * ---------------
 * 
 * main.js
 * -------
 * An HTML5 game about the Finnish University system. I'm maybe trying to
 * understand something about it. 
 * 
 * This is the main code file containging the game logic and UI.
 *======================================================================*/
(function (window, $) {

/**
 * Keeps track and updates the game state. 
 */
function Logic () {
    
    var resources = new Resources(5, 0, 2);
    var resourceIncome = new Resources(0, 0, 0);
    
    var units = [new Unit(0.2, 0.1, 0.1)];
    
    this.getUnitCount = function() {
        return units.length;  
    };
    
    this.getResource = function(resource) {
        return resources[resource];
    };
    
    this.getIncome = function(resource) {
        return resourceIncome[resource];
    };
    
    this._countUpkeep = function() {
        var upkeep = new Resources();
        for (var i = 0; i < units.length; i++) {
            upkeep = upkeep.add(units[i].getUpkeep());
        }
        return upkeep;
    };
    
    this._countIncome = function() {
        var income = new Resources();
        for (var i = 0; i < units.length; i++) {
            income = income.add(units[i].getIncome());
        }
        return income;
    };
    
    this.update = function() {
        var upkeep = this._countUpkeep();
        var income = this._countIncome();
        
        resourceIncome = income.subtract(upkeep);
        resources = resources.add(resourceIncome);
    };
}



/**
 * Contains the interface between the HTML page (and the player) and the game logic.
 * Handles initialization of game objects and state, along with UI features.
 */
function Game () {
    
    var valueFields = {};
    
    /**
     * Sets up the game UI with EaselJS 
     * @param {String} canvasID the ID name of the canvas on the page to use
     */
    this.start = function(canvasID) {
        this.stage = new createjs.Stage(canvasID);
        this.logic = new Logic();
        
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
    };
    
    
    /**
     * Updates the UI according to the state of the Logic, ie. changes values
     * in the HTML page for the user to see. 
     */
    this.updateValues = function() {
       $("#gold .resource-amount").text(this.logic.getResource("gold").toFixed(0));
       $("#local .resource-amount").text(this.logic.getResource("local").toFixed(0));
       $("#inter .resource-amount").text(this.logic.getResource("inter").toFixed(0));
       
       $("#gold .resource-income").text(this.logic.getIncome("gold").toFixed(1));
       $("#local .resource-income").text(this.logic.getIncome("local").toFixed(1));
       $("#inter .resource-income").text(this.logic.getIncome("inter").toFixed(1));             
    };
    
    
    /**
     * Progress the game state, then redraw the canvas. 
     */
    this.update = function() {
        this.logic.update();
        this.updateValues();
        this.stage.update();
    };
  
};


window.TiedeGame = new Game();

}(window, $));

