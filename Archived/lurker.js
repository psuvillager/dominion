
class lurkerPattern{
  constructor({ o}){

  }

}


    //TODO: modifying patterns to perform different actions on activate, on deactivate, and on trigger (ie event match)


    // Each pattern has:
    //   - eventFilter (func that determines what counts as a trigger,
    //                  takes an event object and returns a Boolean)
    //      ...INSTEAD of explicit typeFilter and targetFilter:
    //          - typeFilter (func, takes an event object and returns a Boolean) 
    //          - targetFilter (func, takes an event object and returns a Boolean) 
    //   - onTrigger (array, whose elements are objects with two methods):
    //     - 'determineArgs': receives the pattern's 'options' object, 
    //        returns an array of args that will be passed to 'callback'
    //     - 'callback' receives the 'args' array returned by 'determineArgs',
    //        and creates side effects
    //   - onActivate (array, whose elements are objects with two methods):
    //     - 'determineArgs': receives the pattern's 'options' object, 
    //        returns an array of args that will be passed to 'callback'
    //     - 'callback' receives the 'args' array returned by 'determineArgs',
    //        and creates side effects
    //   - onDeactivate (array, whose elements are objects with two methods):
    //     - 'determineArgs': receives the pattern's 'options' object, 
    //        returns an array of args that will be passed to 'callback'
    //     - 'callback' receives the 'args' array returned by 'determineArgs',
    //        and creates side effects
    //   - an optional 'options' object that can be used when determining args
    //     (and hopefully when filtering events, although tweaks may be needed)

class Lurker{
  constructor({name, patterns = [], options = {onActive = () => } }){
    this.name = name;
    this.patterns = patterns;
    this.
    this.register();
  }
  addPattern = pattern => {
    this.patterns.push(pattern);
  }
  only = () => {
    if(!Lurker.registry){
      Lurker.registry = {};
    }
    for(lurker of Object.values(Lurker.registry)){
      Lurker.deactivate();
    }
    this.activate();
  }
  activate = () => { this.isActive = true; }
  deactivate = () => { this.isActive = false; }
  getStatus = () => this.isActive;
  getName = () => this.name;

  register = () => {
    if(!Lurker.registry){
      Lurker.registry = {};
    }
    Lurker.registry[this.name] = this;
  }
  unregister = () => {
    if(Lurker.registry){
      delete Lurker.registry[this.name];
    }
  }
  consider = event => {
    
    let match;
    for(let pattern of this.patterns){
      if( (pattern.typeFilter(event) === true) && (pattern.targetFilter(event) === true) ){
        match = pattern;
        break;
      }
    };
    if(match){
      for(let actionToTake of match.onTrigger){
        let args = actionToTake.determineArgs(match.options);
        let callback = actionToTake.callback;
        callback(args);
      }
    }
  }
  static handle = event => {
   for(let lurker of Object.values(Lurker.registry)){
      if(lurker.isActive){
        lurker.consider(event);
      }
    }
  }
}