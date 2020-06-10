// RNG and hashing utilities

export function to_base_n(number, base){
	if(number <0){
		return "error";
	}
	
	if(number < base){
		return [number]
	}
	else{
		var x = to_base_n(Math.floor(number/base), base);
		x.push(number% base);
		return x;
	}
}
export function convert(m){ // converts m to unsigned
	if(m < 0){
		m = (2**32) + m;
	}
	return m; 
}

export function or(a,b){ // bitwise or, as 32 bit numbers
	return convert( a | b);
}
export function and(a,b){ // bitwise or, as 32 bit numbers
	return convert( a & b);
}

export function xor(a,b){ // bitwise or, as 32 bit numbers
	return convert( a ^ b);
}
export function not(a){
	return convert(~a);
}
export function rotate(number ,amount){
	var m =or(convert(number >>> amount ), convert(number  << (32-amount)))
	return m;
}

export function to_32_bit(a,b,c,d){ // 4 numbers 0-255 to a single 32-bit number
	return a*256*256*256+ b*256*256 + c*256 + d
}
export function add(x,y){
	return (x+y)%(2**32)
}

export function add_zeroes(x){ // add zeroes until the result is length 8
	if(x.length >= 8){
		return x;
	}
	var m = [0];
	while(m.length + x.length != 8){
		m.push(0);
	}
	return m.concat(x);
}
var rounds = 64;
export function sha256_core(m){ // m is a list of numbers ,each 8 bits. note that each letter is 8 bits.
	var len = to_base_n(m.length*8, 256);
	m.push(128);
	//length is 448 (mod 512), but divide by 8, so it's 56 (mod 64)
	while(m.length %64 != 56){
		m.push(0);
	}
	while(m.length%64 + len.length != 64){
		m.push(0);
	}
	// convert length to base 256
	m=m.concat(len);
	
	// round constants
	var k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
   0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
   0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
   0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
   0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
   0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
   0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
   0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
	var current_chunk = 0;
	var total_chunks = m.length/64;
	// hash values
	var h0 = 0x6a09e667;
	var h1 = 0xbb67ae85;
	var h2 = 0x3c6ef372;
	var h3 = 0xa54ff53a;
	var h4 = 0x510e527f;
	var h5 = 0x9b05688c;
	var h6 = 0x1f83d9ab;
	var h7 = 0x5be0cd19;
	
	while(current_chunk < total_chunks){
		var w = [];
		// copy first 16 words
		for (var i=0;i<16;i++){
			w.push(to_32_bit(m[64*current_chunk + 4*i + 0],m[64*current_chunk + 4*i + 1],m[64*current_chunk + 4*i + 2],m[64*current_chunk + 4*i + 3]));
		}
		// expand to rest of them
		for(var i=16;i<=rounds-1;i++){
			var s0 = xor(rotate(w[i-15] , 7), xor(rotate(w[i-15] , 18), w[i-15]>>>3));
			var s1 = xor(rotate(w[i-2] , 17), xor(rotate(w[i-2] , 19), w[i-2]>>>10));
			w.push((w[i-16] + s0 + w[i-7] + s1)%(2**32));
		}
		var a = h0;
		var b = h1;
		var c = h2;
		var d = h3; 
		var e = h4;
		var f = h5;
		var g = h6;
		var h = h7;
		//mainloop
		for(var i=0; i<=rounds-1;i++){
			var s1 = xor(rotate(e, 6), xor(rotate(e, 11), rotate(e, 25)));
			var ch =xor( and(e,f ), and(not(e), g));
			var temp1 = (h + s1 + ch + k[i] + w[i])%2**32;
			var s0  = xor(rotate(a, 2) , xor(rotate(a, 13), rotate(a, 22)));
			var maj = xor(xor(and(a, b) , and(a, c)), and(b, c));
			var temp2 = (s0 + maj)%(2**32)
			h = g;
			g = f;
			f = e;
			e = (d + temp1) % (2**32);
			d = c;
			c = b;
			b = a;
			a = (temp1 + temp2)%(2**32);
		}
		h0 = ( h0 + a)%(2**32);
		h1 = ( h1 + b)%(2**32);
		h2 = ( h2 + c)%(2**32);
		h3 = ( h3 + d)%(2**32);
		h4 = ( h4 + e)%(2**32);
		h5 = ( h5 + f)%(2**32);
		h6 = ( h6 + g)%(2**32);
		h7 = ( h7 + h)%(2**32);
		current_chunk += 1;
	}
	var x = add_zeroes(to_base_n(h0,16));
	x=x.concat(add_zeroes(to_base_n(h1,16)));
	x=x.concat(add_zeroes(to_base_n(h2,16)));
	x=x.concat(add_zeroes(to_base_n(h3,16)));
	x=x.concat(add_zeroes(to_base_n(h4,16)));
	x=x.concat(add_zeroes(to_base_n(h5,16)));
	x=x.concat(add_zeroes(to_base_n(h6,16)));
	x=x.concat(add_zeroes(to_base_n(h7,16)));
	return x;
}
export function string_to_bytes(m){
	m = m.toString();
	var s = [];
	for(var i=0;i<m.length;i++){
		s.push(m[i].charCodeAt());
	}
	return s
}
export function sha256(m){
	var x= sha256_core(string_to_bytes(m));
	var s = "";
	for(var i=0; i<x.length;i++){
		s += "0123456789abcdef"[x[i]];
	}
	return s;
}
export function get_number(seed){
	//extract first 12 digits and use it as a number
	var lst = sha256_core(string_to_bytes(seed));
	var s = lst[0];
	for(var i=1;i<12;i++){
			s = 16*s;
			s += lst[i];
	}
	return s;
}
export function randint(low, high, seed){
	//returns a number from [low, high)
	if(high < low){
		throw "high smaller than low";
	}
	return get_number(seed) %(high-low) + low;
}
var calls = 0;
export function rand(seed){
	calls+=1;
	//returns a number from [0, 1)
	return get_number(seed) / 2**48;
}

export function choice(list,seed){
	if(list instanceof Set){
		list = 	[...list];
	}
	if(list.length == 0){
		throw "choice with empty list"
	}
	return list[randint(0, list.length,seed)]
}
// list utilities

export function point_on_circle(distance, seed){
	var angle = rand(seed)*2*Math.PI;
	return ([Math.floor(distance * Math.cos(angle)), Math.floor(distance * Math.sin(angle))]);
}
export function replace_all(string, s, t){
	//replace all instances of s with t in string.
	while(string.indexOf(s) != -1){
		string = string.replace(s, t);
	}
	return string
}

export class AssertionError extends Error {
	constructor(msg){
		super();
		this.msg = msg;
	}
}

export function count(array, value){ //count the number of value's
	var counter=0;
	for(var i=0;i<array.length;i++){
		if(array[i]==value){
			counter+=1;
		}
	}
	return counter;
}

function union(a, b){
	return new Set([...a, ...b])
}
function array_equal(a, b) {
  if (a === b) return true;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


export function assert(condition){
	if(!condition){
		throw new AssertionError(condition.toString());
	}
}
// fill array with this value
export function fillArray(value, len) {
  if (len == 0) return [];
  return [value].concat(fillArray(value, len-1));

}

// adds object 2 to object 1, mutates object 1
export function addObject(obj1, obj2){
	console.log("adding")
	console.log(obj1, obj2)
	if(typeof(obj1) != "object" || typeof(obj2) != "object"){
			throw "addObject for non-objects"
	}
	Object.keys(obj2).forEach(function(key){
		if(obj1[key]== undefined){
			obj1[key] = obj2[key];
		} else {
			obj1[key] += obj2[key];
		}
	})
}

// dungeon utilities


//returns if this is a valid move.
// direction is up, down, left , right
function is_valid_move(rows, cols, walls, x, y, direction){
	// move off the map?
	if(x == 0 && direction == "left"){
		return false;
	}
	if(y == 0 && direction == "up"){
		return false;
	}
	if(x == cols-1 && direction == "right"){
		return false;
	}
	if(y == rows-1 && direction == "down"){
		return false;
	}
	
	for(var wall of walls){
		// check if this wall prevents movement
		switch(direction){
			case "up":
				if(array_equal([x, y-1, "down"],  wall)){
					return false;
				}
			break;
			case "down":
				if(array_equal([x, y, "down"],  wall)){
					return false;
				}			
			break;
			case "left":
				if(array_equal([x-1, y, "right"],  wall)){
					return false;
				}
			break;
			case "right":
				if(array_equal([x, y, "right"],  wall)){
					return false;
				}
			break;
		}
	}
	return true;
} 


// returns a list of "reachable" locations  (as space-separated string), and the walls that are part of the "frontier". Both are sets


export function bfs(rows, cols, walls, start_x, start_y){
	var unsearched = new Set([start_x + " " + start_y])
	var reachable = new Set([start_x + " " + start_y]);
	while(unsearched.size != 0){

		// iterate over unsearched 
		var new_unsearched = new Set();
		unsearched.forEach(function(point){
				var split_point = point.split(" ")
				var x = parseInt(split_point[0]);
				var y = parseInt(split_point[1]);
				if(!reachable.has((x-1) + " " + y) && is_valid_move(rows, cols, walls, x, y, "left")){
					new_unsearched.add((x-1) + " " + y)
				}
				if(!reachable.has((x+1) + " " + y) && is_valid_move(rows, cols, walls, x, y, "right")){
					new_unsearched.add((x+1) + " " + y)
				}
				if(!reachable.has(x + " " + (y-1)) && is_valid_move(rows, cols, walls, x, y, "up")){
					new_unsearched.add(x + " " + (y-1))
				}
				if(!reachable.has(x + " " + (y+1)) && is_valid_move(rows, cols, walls, x, y, "down")){
					new_unsearched.add(x + " " + (y+1))
				}
		})
		unsearched = new_unsearched;
				// union unsearched and reachable
		reachable = union(reachable, unsearched)
	}
	var frontier_walls = new Set();
	walls.forEach(function(wall){
		// check if the wall is at the edge of the dungeon
		if(wall[1] == rows-1 && walls[2] == "down"){
			return ; 
		}
		if(wall[0] == cols-1 && walls[2] == "right"){
			return ; 
		}
		if(wall[2] == "right" && reachable.has(wall[0] + " " + wall[1]) != reachable.has((wall[0]+1) + " " + wall[1]) ){
			frontier_walls.add(wall)
		}
		if(wall[2] == "down" && reachable.has(wall[0] + " " + wall[1]) != reachable.has(wall[0] + " " + (wall[1]+1)) ){
			frontier_walls.add(wall)
		}
	})
	return [reachable, frontier_walls]
}

/*

test cases: (t1.png)

 4, 7, [[0,0,"right"],[0,1,"down"],[0,2,"right"],[1,0,"right"],[1,1,"down"],[2,1,"right"],[2,1,"down"],[2,2,"right"],[2,2,"down"],[2,3,"right"],[3,0,"down"],[3,2,"right"],[3,2,"down"],[4,1,"right"],[4,1,"down"],[5,2,"down"],[6,0,"down"],[6,2,"down"]]
0, 0

all except bottom left part

 4, 7, [[0,0,"right"],[0,1,"down"],[0,2,"right"],[1,0,"right"],[1,1,"down"],[2,1,"right"],[2,1,"down"],[2,2,"right"],[2,2,"down"],[2,3,"right"],[3,0,"down"],[3,2,"right"],[3,2,"down"],[4,1,"right"],[4,1,"down"],[5,2,"down"],[6,0,"down"],[6,2,"down"]]
0, 3

only bottom left part 

*/