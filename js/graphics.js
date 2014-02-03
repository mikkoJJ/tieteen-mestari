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
        height: 200,
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
ProgressBar.prototype.initialize = function(width, height) {
    this.Container_initialize();
    
    this.height = height ? height : OPTIONS.progressBar.height;
    
    this.color = OPTIONS.progressBar.color;
    this.background = OPTIONS.progressBar.background;
        
    var bar = new createjs.Shape();
    var bg = new createjs.Shape();
    
    this.setBounds(0, 0, width, this.height);
    bar.setBounds(0, 0, width, this.height);
    bar.name = "progress";
    
    bg.graphics.beginFill(OPTIONS.progressBar.background).drawRoundRect(
            0,
            0, 
            Math.floor(width), 
            this.height, 
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
    
    bar.graphics.clear();
    
    bar.graphics.beginFill(OPTIONS.progressBar.color).drawRoundRect(
        0, 
        0, 
        Math.floor(bounds.width * source.getProgress()), 
        this.height, 
        8, 8, 8, 8);
};



//======================================================================================== CHARACTER

/**
 * A visual game character. Walks around the game area and can be mouseovered, clicked
 * and interacted with in other ways.
 * @class Character
 * @extends createjs.Container 
 * @param {Object} source the game logic source of this character.
 * @param {Image} spritePath the path to the sprite image of this character
 */
var Character = function(source, sprite) {
    this.initialize(source, sprite);
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
    
function StudentContainer(stage, assets) {
    this._container = new createjs.Container();
    this._container.name = "classroom";
    this._assets = assets;
    
    this.nextPosition = {x: 20, y: 50};
    this.fill = [];
    
    stage.addChild(this._container);
        
    this.addStudent = function(student) {
      
        //create and place the container:
        var character = new Character(student, this._assets.getResult(student.sprite));
        var count = this._container.getNumChildren();
        
        var spriteWidth = character.getTransformedBounds().width;
        var spriteHeight = character.getTransformedBounds().height;
        character.x = this.nextPosition.x;
        character.y = this.nextPosition.y;
        
        if(this.fill.length > 0) {
            character.x = this.fill[0].x;
            character.y = this.fill[0].y;
            this.fill.splice(0,1);
        }
        else {
            character.x = this.nextPosition.x;
            character.y = this.nextPosition.y;
            this.nextPosition.x += OPTIONS.studentSprite.width * OPTIONS.studentSprite.scale;
            if(this.nextPosition.x > OPTIONS.studentContainer.width) {
                this.nextPosition.x = 20;
                this.nextPosition.y += OPTIONS.studentSprite.height * OPTIONS.studentSprite.scale;    
            }
        }
        
        this._container.addChild(character);
    };
    
    this.removeStudent = function(student) {
        var character = student.graphics;
        
        this.fill.push({x: character.x, y: character.y});
        
        this._container.removeChild(character);
    };
    
}

window.StudentContainer = StudentContainer;
window.ProgressBar = ProgressBar;

}(window));