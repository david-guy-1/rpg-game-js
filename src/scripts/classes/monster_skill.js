class monster_skill{
    constructor(name,damage,delay,self_effects,target_effects,global_effects){
		this.name = name;
        this.damage = damage;
        this.delay = delay;
		this.self_effects = self_effects;
		this.target_effects = target_effects;
		this.global_effects = global_effects; //global = all monsters
    }
}

export default monster_skill;