import * as U from '../utilities.js';
class player_skill{
    constructor(name,damageMult,cd,delay,mana,self_effects,target_effects,global_effects,description){
		U.assert(U.check_type(arguments, 
		["string", "number", "number", "number", "number", Array, Array, Array, "string"]
		
		));
		this.name = name;
        this.damageMult = damageMult;
        this.cd = cd;
		this.delay = delay;
		this.mana = mana;
        //by default, this will be applied to self, target monster, or all monsters
		this.self_effects = self_effects;
		this.target_effects = target_effects;
		this.global_effects = global_effects; 
		
		this.description = description;	
    }
}

export default player_skill;