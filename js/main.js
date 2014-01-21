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
        
        this.setupUI();
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
    };
    
    
    this.setupUI = function() {
        var rowHeight = 20;
        var valueOffset = 120;
        var incomeOffset = 40;
        var font = "16px Hammersmith One";
        var box = new createjs.Container(); 
        box.x = 5;
        box.y = 5;
        
        var goldLabel = new createjs.Text("Kulta", font, "black");
        var gold = new createjs.Text("0", font, "black");
        var goldIncome = new createjs.Text("0", font, "black");
        gold.x = valueOffset;
        goldIncome.x = gold.x + incomeOffset;
        
        var localLabel = new createjs.Text("Tutkimus", font, "black");
        localLabel.y = rowHeight;
        var local = new createjs.Text("0", font, "black");
        var localIncome = new createjs.Text("0", font, "black");
        local.y = localLabel.y;
        local.x = valueOffset;
        localIncome.y = local.y; localIncome.x = local.x + incomeOffset;
        
        var interLabel = new createjs.Text("KV-tutkimus", font, "black");
        interLabel.y = rowHeight * 2;
        var inter = new createjs.Text("0", font, "black");
        var interIncome = new createjs.Text("0", font, "black");
        inter.y = interLabel.y;
        inter.x = valueOffset;
        interIncome.y = inter.y; interIncome.x = inter.x + incomeOffset;
        
        box.addChild(goldLabel, localLabel, interLabel, gold, local, inter, goldIncome, localIncome, interIncome);
        valueFields.gold = gold; valueFields.local = local; valueFields.inter = inter;
        valueFields.goldIncome = goldIncome; valueFields.localIncome = localIncome; valueFields.interIncome = interIncome;
        
        this.stage.addChild(box);
    };  
    
    
    this.updateValues = function() {
        valueFields.gold.text = this.logic.getResource("gold").toFixed(0);
        valueFields.local.text = this.logic.getResource("local").toFixed(0);
        valueFields.inter.text = this.logic.getResource("inter").toFixed(0);
        
        valueFields.goldIncome.text = "(" + this.logic.getIncome("gold").toFixed(1) + ")";
        valueFields.localIncome.text = "(" + this.logic.getIncome("local").toFixed(1) + ")";
        valueFields.interIncome.text = "(" + this.logic.getIncome("inter").toFixed(1) + ")";             
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

