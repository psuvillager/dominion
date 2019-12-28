function linkArrayElements(array, circular = false){
  // Handles empty arrays
  if(!array.length){
    console.log("'linkArrayElements' failed: Array must include at least one Element");
    return array;
  }
  // Handles primitives
  if(!array.every(el => el instanceof Object)){
    console.log("'linkArrayElements' failed: All array elements must be Objects");
    return array;
  }

  // Adds a method to each element that retrieves the next element
  // If 'circular' is true, the last element links back to the first
  let finalLink = circular ? array[0] : null;
  array.forEach( (el, ind) => {
    //console.log("LAE ind: " + ind);
    let
      nextInd = ind + 1,
      next = array[nextInd] || finalLink;
      //console.log("LAE: ")
      //console.log(el);
    el.next = next; // This isn't working as expected in "dominion _local.html"
    //console.log(el.name + ": " + el.next.name);
  });
  return array;
}


/*
// Player class
class Player{
  constructor(definitionObj){
    // (Called via Player.initializePlayers, which first clears registry)
    this.name = definitionObj.name;
    this.type = definitionObj.type;
    this.points = 0;
    this.initializeCardLocations();
    this.resetResources();
  }
  initializeCardLocations(){
    this.deck = [];
    this.hand = [];
    this.inPlay = [];
    this.discards = [];
  }
  resetResources(){
    this.actions = 1;
    this.buys = 1;
    this.coins = 0;
  }
  updatePoints(){
    let allCards = this.deck.concat(this.hand, this.inPlay, this.discards);
    this.points = allCards.reduce( (sum, card) => sum += card.points, 0);
    return this.points;
  }
  static initializePlayers(definitions){
    this.registry = linkArrayElements(randomizeArray(definitions), true).reduce( (registry, definition) => {
      registry[definition.name] = new Player(definition);
      return registry;
    }, {});
    return this.registry;
  }
}

Player.initializePlayers([{name: "Bob", type: "human"},{name: "Alex", type: "human"}]);
let player = 
*/