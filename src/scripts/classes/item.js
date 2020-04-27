class item{
    constructor(name,attack,defense,hp,mana,description){
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.hp = hp;
        this.mana = mana;
        this.description = description;
	}
    clone(){
        return new item(this.name,this.attack,this.defense,this.hp,this.mana,this.description);
    }
}

export default item;