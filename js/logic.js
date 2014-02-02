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
    //at the end of term, how many gold does each resource yield
    resourceRate: {
        graduates: 60,
        research: 50
    },
    
    baseStudentGrowth: 2,
    
    startingGold: 300
};
 
/**
 * The object that keeps track of the game state, such as
 * resources and units. 
 * 
 * Exposes the following events for controllers to bind to:
 *  - newPerson
 *  - removed
 *  - newTerm
 */
function TiedeLogic () {
    
    this._eventListeners = [];
    this._people = [];
    this.paused = false;
    this._currentUpkeep = 0;
    
    //length of one term in seconds:
    this.termLength = 60;
    this.termNumber = 1;
    this._termProgress = 0.0;
    
    this.resources = {
        gold : OPTIONS.startingGold,
        graduates : 0,
        research : 0
    };
    
    this.addEventListener = function(event, listener) {
        this._eventListeners.push({ e: event, listener: listener });
    };
    
    
    this.getResource = function(resource) {
        return this.resources[resource]; 
    };
    
    this.getCurrentUpkeep = function() {
        return this._currentUpkeep;    
    };
    
    this.addResource = function(resource, amount) {
        this.resources[resource] += amount;
    };
    
    this.resourceToGold = function(resource) {
        return this.resources[resource] * OPTIONS.resourceRate[resource];
    };
    
    this.resetResources = function() {
        this.resources["research"] = 0;
        this.resources["graduates"] = 0;  
    };
    
    this.getProgress = function() {
        return this._termProgress / this.termLength;  
    };
    
    this.pause = function() {
        this.paused = true;
    };
    this.unpause = function() {
        this.paused = false;  
    };
    
    this.getUnits = function() {
        return this._people;
    };
    
    /**
     * Performs logic tasks related to the new term coming. 
     */
    this.newTerm = function() {
        var gain = 0;
        gain += this.resourceToGold("research");
        gain += this.resourceToGold("graduates");
        
        this.addResource("gold", gain);
        
        var studentGrowth = OPTIONS.baseStudentGrowth + this.getResource("graduates") / 10;
        for(var i=0; i<studentGrowth; i++) this.addUnit(new Student());
        
        this.termNumber++;
        this.resetResources();
    };
    
    /** Emits a given event. Listener callbacks are called. */
    this._emit = function(event, params) {
        for(var i=0; i<this._eventListeners.length; i++) {
            if(this._eventListeners[i].e == event) this._eventListeners[i].listener(params);
        }
    };    
    
    /**
     * Progresses the university logic state one tick
     * forward. Income and study progress is updated.
     */
    this.update = function(deltaTime) {        
        if(this.paused) return;
        
        var upkeep = 0;
        
        for (var i = 0; i < this._people.length; i++) {
            var elem = this._people[i];
            elem.update(deltaTime);
            upkeep += elem.getUpkeep();
            
            if(elem.isDone()) {
                var yield = elem.yield();
                this.addResource(yield.type, yield.amount);
                
                if( !elem.isContinuous() ) {
                    this._people.splice(i, 1);
                    this._emit("removed", elem);
                }
                else {
                    elem.restart();
                }
            }     
        }
        
        this._currentUpkeep = -upkeep;
        this.addResource("gold", -(upkeep * deltaTime));
        
        this._termProgress += deltaTime;
        if(this._termProgress >= this.termLength) {
            this._emit("newTerm");
            this._termProgress = 0.0;
        } 
    };
    
    this.addUnit = function(unit) {
        this._emit("newPerson", unit);
        this._people.push(unit);
    };
          
    this.addStudent = function(student) {
        this._emit("newPerson", student);
        
        this._people.push(student);
    };
    
    
    this.addStaff = function(staff) {
        this._emit("newPerson", staff);
        
        this._people.push(staff);  
    };
}

window.TiedeLogic = TiedeLogic;

}(window, $));
