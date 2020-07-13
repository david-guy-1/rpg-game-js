import * as U from '../utilities';
class player_skill{
    constructor(name,damageMult,cd,delay,mana,self_effects,target_effects,global_effects,description, flags = {}){
		U.assert(U.check_type(arguments, 
		["string", "number", "number", "number", "number", Array, Array, Array, "string", "object"]
		
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
		this.flags = flags;
		// recognized flags:
		//"require item, require item with tag, require monster tag, require other effect" (all are OR)

    }
		has_flag(flag_name){
		return this.flags[flag_name] != undefined
	}
	get_flag(flag_name){
		return this.flags[flag_name];
	}
	
}

export default player_skill;
