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
    
    var resources = new Resources(100, 0, 0);
    var resourceIncome = new Resources(0, 0, 0);
    var staff = [new Unit(0,0,0)];
    var students = [new Student(), new Student()];
    
    this.getStaffCount = function() {
        return staff.length;  
    };
    
    this.getStudentCount = function() {
        return students.length;
    };
    
    this.getResource = function(resource) {
        return resources[resource];
    };
    
    this.getIncome = function(resource) {
        return resourceIncome[resource];
    };
    
    
    /** 
     * Counts the upkeep of all staff within the
     * university. 
     */
    this._countUpkeep = function() {
        var upkeep = new Resources();
        for (var i = 0; i < staff.length; i++) {
            upkeep = upkeep.add(staff[i].getUpkeep());
        }
        return upkeep;
    };
    
    
    /**
     * Counts the income for different resources for the 
     * whole university. 
     */
    this._countIncome = function() {
        var income = new Resources();
        for (var i = 0; i < staff.length; i++) {
            income = income.add(staff[i].getIncome());
        }
        return income;
    };
    
    /**
     * Progresses studies for all studens in the
     * university. 
     */
    this._progressStudies = function() {
        for (var i = 0; i < students.length; i++) {
            students[i].study();
            
            if(students[i].canGraduate()) {
                students.splice(i, 1);
                console.log("graduated");
            }     
        }  
    };
    
    /**
     * Progresses the university logic state one tick
     * forward. Income and study progress is updated.
     */
    this.update = function() {
        var upkeep = this._countUpkeep();
        var income = this._countIncome();
        
        resourceIncome = income.subtract(upkeep);
        resources = resources.add(resourceIncome);
        
        this._progressStudies();
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
        
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(1);
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
       
       $("#gold .resource-income").text("(" + this.logic.getIncome("gold").toFixed(1) + ")");
       $("#local .resource-income").text("(" + this.logic.getIncome("local").toFixed(1) + ")");
       $("#inter .resource-income").text("(" + this.logic.getIncome("inter").toFixed(1) + ")");             
       
       $("#staff .personnel-amount").text(this.logic.getStaffCount());
       $("#students .personnel-amount").text(this.logic.getStudentCount());
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

