class player_skill{
    constructor(name,damageMult,cd,mana,self_effects,target_effects,global_effects,description){
		this.name = name;
        this.damageMult = damageMult;
        this.cd = cd;
		this.mana = mana;
        //by default, this will be applied to self, target monster, or all monsters
		this.self_effects = self_effects;
		this.target_effects = target_effects;
		this.global_effects = global_effects; 
		
		this.description = description;	
    }
}

export default player_skill;