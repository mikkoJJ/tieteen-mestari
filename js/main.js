/*=======================================================================
 * Tieteen Mestari
 * ---------------
 * 
 * main.js
 * -------
 * An HTML5 game about the Finnish University system. I'm maybe trying to
 * understand something about it. 
 * 
 * This is the main code file containging the main controller component,
 * the "interface" between the HTML UI and the game logic.
 *======================================================================*/
(function (window, $) {

/**
 * Contains the interface between the HTML page (and the player) and the game logic.
 * Handles initialization of game objects and state, along with UI features.
 */
function Game () {
    
    var valueFields = {};
    
    this._lastTime = 0;
    
    /**
     * Sets up the game UI with EaselJS 
     * @param {String} canvasID the ID name of the canvas on the page to use
     */
    this.start = function(canvasID) {
        this.stage = new createjs.Stage(canvasID);
        this.logic = new TiedeLogic();
        
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
        
        this.logic.addEventListener("graduated", this.removeStudent.bind(this));
        this.logic.addEventListener("newStudent", this.drawStudent.bind(this));
        
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
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
    
    
    this.drawStudent = function(student) {
        var sprite = new createjs.Bitmap("img/opiskelija.png");
        sprite.x = this.logic.getStudentCount() * (60 + 10);
        sprite.scaleX = 0.5;
        sprite.scaleY = 0.5;
        
        student.sprite = sprite;
        
        this.stage.addChild(sprite);
    };
    
    this.removeStudent = function(student) {
        this.stage.removeChild(student.sprite);     
            
    };
    
    
    /**
     * Progress the game state, then redraw the canvas. 
     */
    this.update = function() {
        var time = createjs.Ticker.getTime();
        var deltaTime = (time - this._lastTime) / 1000;
        this._lastTime = time;
        
        this.logic.update(deltaTime);
        this.updateValues();
        this.stage.update();
    };
  
};

window.TiedeGame = new Game();

}(window, $));

