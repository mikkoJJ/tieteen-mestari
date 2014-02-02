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
 * The object that keeps track of the game state, such as
 * resources and units. 
 * 
 * Exposes the following events for controllers to bind to:
 *  - newStudent
 *  - newStaff
 *  - graduated
 */
function TiedeLogic () {
    
    this._eventListeners = [];
    this._people = [];
    this.paused = false;
    this._currentUpkeep = 0;
    
    this.resources = {
        gold : 100,
        graduates : 0,
        research : 0
    };
    
    this.getStaffCount = function() {
        return this._staff.length;  
    };
    
    this.getStudentCount = function() {
        return this._students.length;
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
    
    this.pause = function() {
        this.paused = true;
    };
    this.unpause = function() {
        this.paused = false;  
    };
    
    this.addEventListener = function(event, listener) {
        this._eventListeners.push({ e: event, listener: listener });
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
