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
    
    var timeScale = 1;
    var valueFields = {};
    
    this._lastTime = 0;
    
    /**
     * Sets up the game UI with EaselJS 
     * @param {String} canvasID the ID name of the canvas we're using to draw stuff.
     */
    this.start = function(canvasID) {
        this.stage = new createjs.Stage(canvasID);
        this.logic = new TiedeLogic();
        
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
        
        this.logic.addEventListener("removed", this.removeStudent.bind(this));
        this.logic.addEventListener("newPerson", this.drawStudent.bind(this));
        this.logic.addEventListener("newTerm", this.showTermReport.bind(this));
        
        this.stage.enableMouseOver();
        this.setupUI();
        
        //preload:
        var loader = new createjs.LoadQueue(true);
        loader.on("complete", this.loaded, this);
        loader.loadManifest([
           { id: "student", src: "img/opiskelija.png" },
           { id: "researcher", src: "img/tutkija.png" },
           { id: "teacher", src: "img/opettaja.png" } 
        ]);
        
        this.assets = loader;
        this.students = new StudentContainer(this.stage, this.assets);
    };
    
    /**
     * Called when content has finished preloading. 
     */
    this.loaded = function() {
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        this.logic.addStudent(new Student());
        
        var termProgress = new ProgressBar(400, 40);
        termProgress.setSource(this.logic);
        termProgress.x = termProgress.y = 20;
        this.stage.addChild(termProgress);
    };
    
    /**
     * Sets up the UI. This takes care of binding the different UI
     * elements within the HTML page to the code here using jQuery
     * event bindings. 
     */
    this.setupUI = function() {
        $("#hire-menu-link").click(function(e) {
           e.preventDefault(); 
           $("#hire-menu").toggle();
        });
        
        
        $("#hire-researcher").click(function(e) {
            e.preventDefault();
            TiedeGame.logic.addUnit(new Researcher());
            $("#hire-menu").toggle();
        });
        $("#hire-teacher").click(function(e) {
            e.preventDefault();
            TiedeGame.logic.addUnit(new Teacher());
            $("#hire-menu").toggle();
        });
        
        
        $("#report-close").click(function(e) {
            e.preventDefault();
            TiedeGame.logic.newTerm();
            TiedeGame.logic.unpause();
            $("#report-container").toggle();
        });
        
        $("#speed-up").click(function(e) {
           timeScale++; 
        });
        $("#speed-down").click(function(e) {
           timeScale--; 
        });
        
    };
    
    /**
     * Updates the UI according to the state of the Logic, ie. changes values
     * in the HTML page for the user to see. 
     */
    this.updateValues = function() {
       $("#gold .resource-amount").text(this.logic.getResource("gold").toFixed(0));
       $("#gold .resource-income").text("(" + this.logic.getCurrentUpkeep().toFixed(1) + "/s)");
       $("#research .resource-amount").text(this.logic.getResource("research").toFixed(0));
       $("#graduates .resource-amount").text(this.logic.getResource("graduates").toFixed(0));
       
       $("#time-scale").text(timeScale);
    };
    
    /**
     * Shows a report at the end of term. 
     */
    this.showTermReport = function() {
        this.logic.pause();
        
        $("#term-number").text(this.logic.termNumber);
        $("#report-research .resource-amount").text(this.logic.getResource("research").toFixed(0));
        $("#report-graduates .resource-amount").text(this.logic.getResource("graduates").toFixed(0));
        
        var researchGain = this.logic.resourceToGold("research");
        var graduatesGain = this.logic.resourceToGold("graduates"); 
        
        $("#research-gain .gain-amount").text("+" + researchGain.toFixed(0));
        $("#graduates-gain .gain-amount").text("+" + graduatesGain.toFixed(0));
        $("#total-gain .gain-amount").text("+" + (researchGain + graduatesGain).toFixed(0));
        
        $("#report-container").toggle();
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
        
        this.logic.update(deltaTime * timeScale);
        this.updateValues();
        this.stage.update();
    };
  
};

window.TiedeGame = new Game();

}(window, $));

