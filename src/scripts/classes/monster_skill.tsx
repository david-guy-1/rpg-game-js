import effect from "./effect";

class monster_skill{
	name : string;
	damage : number;
	delay : number;
	self_effects : effect[];
	target_effects : effect[];
	global_effects : effect[]


    constructor(name : string,damage : number,delay : number,self_effects : effect[],target_effects : effect[],global_effects : effect[]){
		this.name = name;
        this.damage = damage;
        this.delay = delay;
		this.self_effects = self_effects;
		this.target_effects = target_effects;
		this.global_effects = global_effects; //global = all monsters
    }
}

export default monster_skill;
