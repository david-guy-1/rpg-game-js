class monster{

    constructor(name,attack,defense,hp,flags,attack_pattern,drops, currency_drops){
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.hp = hp;
        this.max_hp=hp;
        this.effects = [];
        this.flags = flags; // is the monster, say, undead . 
        this.attack_pattern = attack_pattern; // not used right now
        this.drops = drops; // item drops list
		this.currency_drops = currency_drops; // currency drops list
		this.current_cd = 0;
		
    }
	has_flag(flag_name){
		return this.flags.indexOf(flag_name) != -1
	}
}
export default monster; 

