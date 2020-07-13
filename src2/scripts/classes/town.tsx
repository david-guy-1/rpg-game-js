/*
What should a "town" class contain?

- name (might be used to choose which image to display, where buttons go, etc, however, that's part of the display and we don't have it here)

see "town_mechanics.tsx" for what happens when a button is clicked
 
*/
// "rectangles" are quintuples ("tlx, tly, brx, bry, color")
class town{
    constructor(name,rectangles){
        this.name = name;
		this.rectangles = rectangles;
	}
    clone(){
        return new town(this.name,this.rectangles);
    }
}

export default town;
