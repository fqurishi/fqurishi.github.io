export const gamefunctions = (function() {
  return {
    ladderUpCollision: function(x, y) {
      //get y positions of all floors
      const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
      //check to see where player currently is, let him move accordingly
      if (y >= groundFloor && y < firstFloor){
        //first floor ladders position
        if (x <= 4.8 && x >= 3){
          return true;
        }else{
          return false;
        }
      }else if (y >= firstFloor && y < secondFloor){
        //second floor ladders position
        if ((x <= -9.8 && x >= -11) || (x >= 17.8 && x<= 19)){
          return true;
        }else{
          return false;
        }
      }else if (y >= secondFloor && y < thirdFloor){
        //third floor ladders position
        if ((x >= -21 && x<= -19.8) || (x >= 7 && x <= 8)){
          return true;
        }else{
          return false;
        }
      }else if (y >= thirdFloor && y < fourthFloor){
        //fourth floor's ladders position
        if ((x >= -7 && x<= -5) || (x >= 14 && x <= 16)){
          return true;
        }else{
          return false;
        }
      //cant go up if youre on fourth floor
      }else if (y == fourthFloor){
        return false;
      }
      else{
        return false;
      }
    },

    ladderDownCollision: function(x, y) {
      //get y positions of all floors
      const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
      //check to see where player currently is, let him move accordingly
      if (y == groundFloor){
        return false;
      }else if (y > groundFloor && y <= firstFloor){
        if (x >= 3 && x <= 4.8){
          return true;
        }else{
        return false;
        }
      }else if (y > firstFloor && y <= secondFloor){
        if ((x <= -9.8 && x >= -11) || (x >= 17.8 && x<= 19)){
          return true;
        }else{
          return false;
        }
      }else if (y > secondFloor && y <= thirdFloor){
        if ((x >= 7 && x<= 8) || (x >= -21 && x <= -19.8)){
          return true;
        }else{
          return false;
        }
      }else if (y > thirdFloor && y <= fourthFloor){
        if ((x >= -7 && x<= -5) || (x >= 14 && x <= 16)){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    },

    usingLadder: function(y) {
      const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
      if (y > groundFloor && y < firstFloor){
          return true;
      }
      else if (y > firstFloor && y < secondFloor){
          return true;
      }
      else if (y > secondFloor && y < thirdFloor){
          return true;
      }
      else if (y > thirdFloor && y < fourthFloor){
          return true;
      }
      else {
          return false;
      }
    },

    setSpriteFloor: function(sprite, y) {
      //get y positions of all floors
      const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
      if(y >= fourthFloor){
        sprite.position.setY(fourthFloor);
      }
      else if ((y >= thirdFloor && y < thirdFloor + 0.5) || (y <= thirdFloor && y > thirdFloor - 0.5)){
          sprite.position.setY(thirdFloor);
      }
      else if((y >= secondFloor && y < secondFloor + 0.5) || (y <= secondFloor && y > secondFloor - 0.5)){
          sprite.position.setY(secondFloor);
      }
      else if((y >= firstFloor && y < firstFloor + 0.5) || (y <= firstFloor && y > firstFloor - 0.5)){
        sprite.position.setY(firstFloor);
      }
      else if((y >= groundFloor && y < groundFloor + 0.5) || y <= groundFloor){
          sprite.position.setY(groundFloor);
      }
      else{
          //do nothing
      }
    },

    isSpriteOnFloor: function(y) {
      //get y positions of all floors
      const firstFloor=-7, secondFloor=-0.3, thirdFloor=6.5, fourthFloor=13.2, groundFloor=-14;
      if(y == firstFloor || y == secondFloor || y== thirdFloor || y == groundFloor || y == fourthFloor){
        return true;
      }
      else{
        return false;
      }
    },

    sameFloor: function(a, b){
      if(a.getY() == b.getY()){
        return true;
      }
      else{
        return false;
      }

    },

    isCollide: function(a, b) {
      let dx = a.getX() - b.getX();
      let dy = a.getY() - b.getY();
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < a.getR() + b.getR()) {
      // collision detected!
        return true;
      }
      else{
        return false;
      }
      
    },

    attack: function(a, b) {
    },
  };
})();