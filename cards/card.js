import "throne_room"

// Card and Pile Classes
  class Card{
    constructor(name, cost){
      this.name = name;
      this.readableName = toTitleCase(name);
      this.cost = cost;
      this.types = [];
      this.provides = { actions: 0, buys: 0, cards: 0, coins: 0, trashing: null, special: null };
      this.points = 0;
      this.triggers = {}; //For when-gain, when-would-gain, etc.
    }
    typesToColor = () => {
      const PURPLE = "#871F78";
      const list = [
        { type: "victory",  color: "green" },
        { type: "curse",  color: PURPLE },
        { type: "reaction", color: "blue" },
        { type: "attack",   color: "darkred" },
        { type: "treasure", color: "orange" },
        { type: "action",   color: "darkgrey" }
      ];
      for(let item of list){
        if(this.types.includes(item.type)){
          return item.color;
        }
      }
    }
    renderIn = htmlElement => {
      htmlElement.dataset.name = this.name;
      htmlElement.innerHTML = this.readableName;
      htmlElement.style.color = this.typesToColor(this.types);
    }
    play = turn => {
      console.log( `${card.name} has no 'play' method defined`);
    }
    static getSource = () => "(not specified)";
    static getDescription = () => [];
    static getInitialCount = numPlayers => 10;
    static new = () => new this.prototype.constructor;
  }
  class Copper extends Card{
    constructor(){
      super("Copper", 0);
      this.types = ["treasure"];
      this.provides.coins = 1;
    }
    play = (turn, activity) => { turn.player.coins += this.provides.coins } // (Wet)
    static getSource = () => "Dominion";
    static getDescription = () => ["Gain 1 coin"];
    static getInitialCount = (numPlayers) => (numPlayers > 4 ? 120 : 60);
  }
  class Silver extends Card{
    constructor(){
      super("Silver", 3);
      this.types = ["treasure"];
      this.provides.coins = 2;
    }
    play = (turn, activity) => { turn.player.coins += this.provides.coins }
    static getSource = () => "Dominion";
    static getDescription = () => ["Gain 2 coins"];
    static getInitialCount = (numPlayers) => {
      return numPlayers > 4 ? 80 : 40;
    }
  }
  class Gold extends Card{
    constructor(){
      super("Gold", 6);
      this.types = ["treasure"];
      this.provides.coins = 3;
    }
    play = (turn, activity) => { turn.player.coins += this.provides.coins }
    static getSource = () => "Dominion";
    static getDescription = () => ["Gain 3 coins"];
    static getInitialCount = (numPlayers) => {
      return numPlayers > 4 ? 60 : 30;
    }
  }
  class Estate extends Card{
    constructor(){
      super("Estate", 2);
      this.types = ["victory"];
      this.points = 1;
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["1 victory point"];
    static getInitialCount = (numPlayers) => (numPlayers > 3 ? numPlayers * 6 : numPlayers * 7);
  }
  class Duchy extends Card{
    constructor(){
      super("Duchy", 5);
      this.types = ["victory"];
      this.points = 3;
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["3 victory points"];
    static getInitialCount = (numPlayers) => {
      return numPlayers > 3 ? numPlayers * 3 : numPlayers * 4;
    }
  }
  class Province extends Card{
    constructor(){
      super("Province", 8);
      this.types = ["victory"];
      this.points = 6;
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["6 victory points"];
    static getInitialCount = (numPlayers) => {
      return (numPlayers > 3 ? numPlayers * 3 : numPlayers * 4);
    }
  }
  class Curse extends Card{
    constructor(){
      super("Curse", 0);
      this.types = ["curse"];
      this.points = -1;
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["-1 victory point"];
    static getInitialCount = (numPlayers) => {
      return (numPlayers - 1) * 10;
    }
  }
  class Village extends Card{
    constructor(){
      super("Village", 3);
      this.types = ["action"];
      this.provides.actions = 2;
      this.provides.cards = 1;
    }
    play = (turn, activity) => {
      turn.player.actions += 2;
      drawX(turn.player, 1);
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["+2 actions","+1 card"];
    static getInitialCount = () => (10);
  }
  class Smithy extends Card{
    constructor(){
      super("Smithy", 4);
      this.types = ["action"];
      this.provides.cards = 3;
    }
    play = (turn, activity) => {
      drawX(turn.player, 3);
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["+3 cards"];
    static getInitialCount = () => (10);
  }
  class Market extends Card{
    constructor(){
      super("Market", 5);
      this.types = ["action"];
      this.provides.actions = 1;
      this.provides.buys = 1;
      this.provides.cards = 1;
      this.provides.coins = 1;
    }
    play = (turn, activity) => {
      turn.player.actions += 1;
      turn.player.buys += 1;
      drawX(turn.player, 1);
      turn.player.coins += 1;
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["+1 action", "+1 buy", "+1 card", "+1 coin"];
    static getInitialCount = () => (10);
  }
  class Witch extends Card{
    constructor(){
      super("Witch", 5);
      this.types = ["action", "attack"];
      this.provides.cards = 2;
    }
    play = (turn, activity) => {
      let player = turn.player;
      drawX(player, 2);
      Moat.initiateAttackActivity(turn, activity, Witch.attack);
      let weHaveAssumedControl = true;
      return weHaveAssumedControl;
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["+2 cards", "Each player other than you gains a curse"];
    static getInitialCount = () => (10);
    static attack = (currentPlayer, specificPlayer) => {
      let cursePile = getPileByName("Curse");
      gain1FromPile(specificPlayer, cursePile);
      console.log(`${specificPlayer.name} gains a curse`);
    }
  }
  class Moat extends Card{
    constructor(){
      super("Moat", 2);
      this.types = ["action", "reaction"];
      this.provides.cards = 2;
    }
    play = (turn, activity) => {
      drawX(turn.player, 2);
    }
    static initiateAttackActivity = (turn, activity, attackFunc) => {
      if(!activity){
        activity = {};
      }
      activity.attack = attackFunc;
      activity.specificPlayer = turn.player.next;
      console.log(activity.attack);
      console.log(activity.specificPlayer);
      Turn.setActiveLurker(Lurker.registry.revealMoat);
    }
    static promptNextVictimOrContinue = (turn, activity) => {
      activity.specificPlayer = activity.specificPlayer.next;
      if(activity.specificPlayer.name != turn.player.name){
        Turn.setActiveLurker(Lurker.registry.revealMoat);
      }
      else{
        Turn.getActiveLurker().deactivate();
      }
    }
    
    trigger = (turn) => {
      // We need to know both 'player' (who played the attack) 
      //   and 'specific player' (who holds the Triggered card)
      // Ideally, show an outputMessage to specificPlayer, listing all 
      //   cards that have been triggered
      // While the list is not empty, wait for specificPlayer to 
      //   choose a listed card to use, remember the choice and 
      //   respond as appropriate (eg set aside Horse Trader...)
      // When the list is empty or specificPlayer chooses to be 'Done', 
      //   go through the remembered choices and determine how to
      //   proceed (eg if they revealed no Moats, they are subjected
      //   to the attack). Then move on to the next specificPlayer.
      // But for now, just check if specificPlayer has a moat and 
      //   if they want to reveal it
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["+2 cards", "When another player plays an attack card, you may first reveal this from your hand to be unaffected by it"];
    static getInitialCount = () => (10);
  }

  class Pile extends Array{
    constructor(cardClass, playerCount){
      super();
      let numNeeded = cardClass.getInitialCount(playerCount);
      while(numNeeded-- > 0){
        this.push((() => new cardClass)());
      }
      this.cardClass = cardClass;
      this.name = cardClass.name;
      this.types = Pile.getCardTypes(this);
      this.cost = Pile.getCardCost(this);
      this.idString = convertStringTo(this.name, "kebab");
      this.readableName = Pile.getReadableName(this);
      this.description = this.cardClass.getDescription();
    }
    render(){
      // TODO: use this to render piles
      console.log(`placeholder for ${this.readableName}Pile.render`);
    }
    static getReadableName(pile){
      return toTitleCase(pile.name);
    }
    static getCardCost(pile){
      let
        cardClass = pile.cardClass,
        card = new cardClass;
      return card.cost;
    }
    static getCardTypes(pile){
      let
        cardClass = pile.cardClass,
        card = new cardClass;
      return card.types;
    }
  }
