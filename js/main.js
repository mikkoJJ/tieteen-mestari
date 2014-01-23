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

var OPTIONS = {
    progressBar: {
        color: "#5FDD7F",
        background: "#243529",
        height: 10,
        padding: 20,
        margin: -10
    },
    studentSprite: {
        scale: 0.8,
        width: 120,
        height: 150,
    },
    studentContainer: {
        width: 400,
        margin: -10,
    },  
};


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
        
        //create the student sprite:
        var sprite = new createjs.Bitmap("img/opiskelija.png");
        sprite.name = "sprite";
        
        sprite.scaleX = OPTIONS.studentSprite.scale;
        sprite.scaleY = OPTIONS.studentSprite.scale;
        
        
        //calculate useful values:
        var spriteWidth = sprite.getTransformedBounds().width;
        var spriteHeight = sprite.getTransformedBounds().height;
        var spriteMargin = OPTIONS.studentContainer.margin;
        var perRow =  Math.floor(OPTIONS.studentContainer.width / (spriteWidth + spriteMargin));
        
        sprite.regX = spriteWidth / 2;
        sprite.regY = spriteHeight / 2;
        sprite.x = sprite.regX;
        sprite.y = sprite.regY + OPTIONS.progressBar.height + OPTIONS.progressBar.margin;
        
        //create and place the container:
        var container = new createjs.Container();
        var studentCount = this.logic.getStudentCount();
        
        var row = Math.floor(studentCount / perRow);
        container.y = row * (spriteHeight + spriteMargin);
        container.x = Math.floor(studentCount % perRow) * (spriteWidth + spriteMargin);
        
        
        //bind events:
        container.addEventListener("mouseover", (function(e){
            //make sprite more visible:
            e.target.scaleX = OPTIONS.studentSprite.scale * 1.1;
            e.target.scaleY = OPTIONS.studentSprite.scale * 1.1;
            //make progressbar visible:
            e.currentTarget.getChildAt(1).alpha = 1;
            e.currentTarget.getChildAt(2).alpha = 1;
        }).bind(this));
        
        container.addEventListener("mouseout", (function(e){
            //undo mouseover actions:
            e.target.scaleX = OPTIONS.studentSprite.scale;
            e.target.scaleY = OPTIONS.studentSprite.scale;;
            //make progressbar invisible:
            e.currentTarget.getChildAt(1).alpha = 0;
            e.currentTarget.getChildAt(2).alpha = 0;
        }).bind(this));
        
        
        //create the progressbar:
        var progress = new createjs.Shape();
        progress.setBounds(0, 0, spriteWidth, OPTIONS.progressBar.height);
        progress.name = "progress";
        progress.student = student;
        progress.alpha = 0; 
        progress.mouseEnabled = false;
        
        progress.addEventListener("tick", function(e) {
            var bar = e.currentTarget;
            var student = bar.student;
            var bounds = bar.getBounds();
            
            bar.graphics.beginFill(OPTIONS.progressBar.color).drawRoundRect(
                OPTIONS.progressBar.padding, 0, 10 + Math.floor((bounds.width - OPTIONS.progressBar.padding * 2) * student.getProgress()), OPTIONS.progressBar.height, 5, 5, 5, 5);
        });
        
        //make the background for the progressbar
        var blackbar = new createjs.Shape();
        blackbar.graphics.beginFill(OPTIONS.progressBar.background).drawRoundRect(
                OPTIONS.progressBar.padding, 0, 10 + Math.floor((spriteWidth - OPTIONS.progressBar.padding * 2)), OPTIONS.progressBar.height, 5, 5, 5, 5);
        blackbar.alpha = 0;
        blackbar.mouseEnabled = false;
        
        
        student.graphics = container;
        
        container.addChild(sprite, blackbar, progress);
        this.stage.addChild(container);
    };
    
    this.removeStudent = function(student) {
        this.stage.removeChild(student.graphics); 
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

