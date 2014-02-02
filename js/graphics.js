/*=======================================================================
 * Tieteen Mestari
 * ---------------
 * 
 * graphics.js
 * --------
 * This file contains graphics objects extending the EaselJS system
 * for the purposes of science!
 *======================================================================*/
(function (window) {

var OPTIONS = {
    progressBar: {
        color: "#5FDD7F",
        background: "#243529",
        height: 10,
        padding: 10,
        margin: -10
    },
    studentSprite: {
        scale: 0.5,
        width: 110,
        height: 150,
    },
    studentContainer: {
        width: 400,
        margin: -10,
    },  
};


//======================================================================================== PROGRESSBAR

/**
 * A visual progressbar. This needs to be hooked up to a source in order to function.
 * This can be done by calling setSource() and giving an object with a getProgress()
 * method. That method should return the value of current progress as a number from 
 * 0 to 1.
 *  
 * @class ProgressBar
 * @extends createjs.Container
 * @param {Object} width the desired width of the progressbar.
 */
var ProgressBar = function(width) {
    this.initialize(width);
};

ProgressBar.prototype = new createjs.Container();

ProgressBar.prototype.Container_initialize = ProgressBar.prototype.initialize;
ProgressBar.prototype.initialize = function(width) {
    this.Container_initialize();
        
    var bar = new createjs.Shape();
    var bg = new createjs.Shape();
    
    this.setBounds(0, 0, width, OPTIONS.progressBar.height);
    bar.setBounds(0, 0, width, OPTIONS.progressBar.height);
    bar.name = "progress";
    
    bg.graphics.beginFill(OPTIONS.progressBar.background).drawRoundRect(
            0,
            0, 
            Math.floor(width), 
            OPTIONS.progressBar.height, 
            8, 8, 8, 8);
    
    this.mouseEnabled = false;
    this._bar = bar;
    this._bg = bg;
    this.addEventListener("tick", this._ticky.bind(this));
    this.addChild(bg, bar);
};

ProgressBar.prototype.setSource = function(source) {
    this._source = source;    
};

ProgressBar.prototype._ticky = function(e) {
    var bar = this._bar;
    var source = this._source;
    var bounds = bar.getBounds();
    
    bar.graphics.beginFill(OPTIONS.progressBar.color).drawRoundRect(
        0, 
        0, 
        Math.floor(bounds.width * source.getProgress()), 
        OPTIONS.progressBar.height, 
        8, 8, 8, 8);
};



//======================================================================================== CHARACTER

/**
 * A visual game character. Walks around the game area and can be mouseovered, clicked
 * and interacted with in other ways.
 * @class Character
 * @extends createjs.Container 
 * @param {Object} source the game logic source of this character.
 * @param {String} spritePath the path to the sprite image of this character
 */
var Character = function(source, spritePath) {
    this.initialize(source, spritePath);
};
    
Character.prototype = new createjs.Container();
Character.prototype.Container_initialize = Character.prototype.initialize;

Character.prototype.initialize = function(source, spritePath) {
    this.Container_initialize();
    
    var sprite = new createjs.Bitmap(spritePath);
    sprite.name = "sprite";
    
    sprite.scaleX = OPTIONS.studentSprite.scale;
    sprite.scaleY = OPTIONS.studentSprite.scale;
    
    //calculate useful values:
    var spriteWidth = sprite.getTransformedBounds().width;
    var spriteHeight = sprite.getTransformedBounds().height;
    
    //sprite.regX = spriteWidth / 2;
    //sprite.regY = spriteHeight / 2;
    sprite.x = sprite.regX;
    sprite.y = sprite.regY + OPTIONS.progressBar.height + OPTIONS.progressBar.margin;
   
    //bind events:
    this.addEventListener("mouseover", (function(e){
        this.progressBar.visible = true;
    }).bind(this));
    
    this.addEventListener("mouseout", (function(e){
        this.progressBar.visible = false;
    }).bind(this));
    
    
    //create the progressbar:
    var progress = new ProgressBar(spriteWidth - OPTIONS.progressBar.padding * 2);
    progress.setSource(source);
    progress.visible = false;
    progress.x = OPTIONS.progressBar.padding;
    //progress.x = progress.regX;
    console.log(spriteWidth);
    
    this._source = source;
    source.graphics = this;
    this.progressBar = progress;
    this.sprite = sprite;
    
    this.addChild(sprite, progress);
    this.setBounds(sprite.getBounds());
};

Character.prototype.getBounds = function() {
    return this.sprite.getBounds();  
};

Character.prototype.getTransformedBounds = function() {
    return this.sprite.getTransformedBounds();  
};



//======================================================================================== STUDENTCONTAINER
    
function StudentContainer(stage) {
    this._container = new createjs.Container();
    this._container.name = "classroom";
    
    stage.addChild(this._container);
        
    this.addStudent = function(student) {
      
        //create and place the container:
        var character = new Character(student, "img/opiskelija.png");
        var count = this._container.getNumChildren();
        
        var spriteWidth = character.getTransformedBounds().width;
        var spriteHeight = character.getTransformedBounds().height;
        var spriteMargin = OPTIONS.studentContainer.margin;
        var perRow =  Math.floor(OPTIONS.studentContainer.width / (spriteWidth + spriteMargin));
        
        var row = Math.floor(count / perRow);
        character.y = row * (spriteHeight + spriteMargin);
        character.x = Math.floor(count % perRow) * (spriteWidth + spriteMargin);
        
        this._container.addChild(character);
    };
    
    this.removeStudent = function(student) {
        this._container.removeChild(student.graphics);
    };
    
}

window.StudentContainer = StudentContainer;

}(window));