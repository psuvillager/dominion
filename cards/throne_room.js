  export class ThroneRoom extends Card{
    constructor(){
      super("Throne Room", 4);
      this.types = ["action"];
    }
    play = (turn, activity) => {
      if(noCardsOfType(turn.player.hand, "action")){ return; }
      // TODO: create this lurker
      //turn.setActiveLurker(Lurker.registry.throneRoom);
    }
    static getSource = () => "Dominion";
    static getDescription = () => ["You may play an Action card from your hand twice."];
    static getInitialCount = () => (10);
  }