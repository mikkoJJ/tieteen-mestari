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
        this.students = new StudentContainer(this.stage);
        
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
        
        this.logic.addEventListener("removed", this.removeStudent.bind(this));
        this.logic.addEventListener("newPerson", this.drawStudent.bind(this));
        
        this.stage.enableMouseOver();
        
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Researcher());
        this.logic.addStudent(new Researcher());
        this.logic.addStudent(new Researcher());
    };
    
    
    /**
     * Updates the UI according to the state of the Logic, ie. changes values
     * in the HTML page for the user to see. 
     */
    this.updateValues = function() {
       $("#gold .resource-amount").text(this.logic.getResource("gold").toFixed(0));
       $("#research .resource-amount").text(this.logic.getResource("research").toFixed(0));
       $("#graduates .resource-amount").text(this.logic.getResource("graduates").toFixed(0));
    };
    
    
    this.drawStudent = function(student) {
        this.students.addStudent(student);        
    };
    
    this.removeStudent = function(student) {
        this.students.removeStudent(student); 
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

