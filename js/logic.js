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
    
    this._resources = new Resources(100, 0, 0);
    this._resourceIncome = new Resources(0, 0, 0);
    this._staff = [new Unit(0,0,0)];
    this._students = [];
    //this._faculties = ["Luonnontieteellinen", "Humanistinen", "Yhteiskuntatietellinen"];
    this._eventListeners = [];
    
    this.getStaffCount = function() {
        return this._staff.length;  
    };
    
    this.getStudentCount = function() {
        return this._students.length;
    };
    
    this.getResource = function(resource) {
        return this._resources[resource];
    };
    
    this.getIncome = function(resource) {
        return this._resourceIncome[resource];
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
    
    
    this.addStudent = function(student) {
        this._emit("newStudent", student);
        
        this._students.push(student);
    };
        
    /** 
     * Counts the upkeep of all staff within the
     * university. 
     */
    this._countUpkeep = function() {
        var upkeep = new Resources();
        for (var i = 0; i < this._staff.length; i++) {
            upkeep = upkeep.add(this._staff[i].getUpkeep());
        }
        return upkeep;
    };
    
    
    /**
     * Counts the income for different resources for the 
     * whole university. 
     */
    this._countIncome = function() {
        var income = new Resources();
        for (var i = 0; i < this._staff.length; i++) {
            income = income.add(this._staff[i].getIncome());
        }
        return income;
    };
    
    
    /**
     * Progresses studies for all studens in the
     * university. 
     */
    this._progressStudies = function(deltaTime) {
        for (var i = 0; i < this._students.length; i++) {
            var student = this._students[i];
            student.study(deltaTime);
            
            if(student.canGraduate()) {
                this._students.splice(i, 1);
                this._emit("graduated", student);
            }     
        }  
    };
    
    
    /**
     * Progresses the university logic state one tick
     * forward. Income and study progress is updated.
     */
    this.update = function(deltaTime) {
        var upkeep = this._countUpkeep(deltaTime);
        var income = this._countIncome(deltaTime);
        
        this._resourceIncome = income.subtract(upkeep);
        this._resources = this._resources.add(this._resourceIncome);
        
        this._progressStudies(deltaTime);
    };
    
}

window.TiedeLogic = TiedeLogic;

}(window, $));
