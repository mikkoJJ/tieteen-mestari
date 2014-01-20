/*=======================================================================
 * Tieteen Mestari
 * ---------------
 * 
 * An HTML5 game about the Finnish University system. I'm maybe trying to
 * understand something about it. 
 * 
 * This is the main code file containging the game logic and UI.
 *======================================================================*/
(function (window, $) {

/**
 * Keeps track and updates the game state. 
 */
function Game () {
    var i = 0;
    
    this.update = function() {
        TiedeUI.setValue(i++);
    };
}


/**
 * Contains all the UI elements as objects. Passes data from the TiedeGame object
 * onto the player, and from player events back to TiedeGame. 
 */
function UI () {
    
    /**
     * Sets up the game UI with EaselJS 
     * @param {Object} canvasID the ID name of the canvas on the page to use
     */
    this.setup = function(canvasID) {
        this.stage = new createjs.Stage(canvasID);
                
        var text = new createjs.Text("21", "20px Arial", "black");
        text.x = 100;
        text.y = 200;
        
        this.value = text;
        
        this.stage.addChild(text);
        this.stage.update();
        
        createjs.Ticker.addEventListener("tick", TiedeGame.update);
    };

    this.setValue = function(val) { 
        this.value.text = val;
        this.stage.update();    
    };
  
};


window.TiedeGame = new Game();
window.TiedeUI = new UI();

}(window, $));

