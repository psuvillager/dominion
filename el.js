// Was based on "configure HTML v1.0.1"
// Has been modified and is currently ahead of configure HTML (2019-11-18)

function El(elOrSelector, unwrap = false){
  if(elOrSelector && typeof elOrSelector == "object"){
    // Wraps the argument, a 'normal' HTML Element, to return an 'El' object
    if("tagName" in elOrSelector){
      this.el = elOrSelector;
    }
    // Returns the argument, an existing 'El' object
    else if(elOrSelector.el && "tagName" in elOrSelector.el){
      return elOrSelector;
    }
  }
  // Handles arguments that are not objects
  else{
    // Treats the argument as a valid selector string
    //   and wraps its selected element, to return an 'El' object
    try{ this.el = document.querySelector(elOrSelector); }
    catch(err){
      console.log(`${elOrSelector} did not provide an HTML Element`);
    }
  }
  if(unwrap === true){ return this.el}
  return this;
}

El.from = function(elOrSelector, unwrap){
  // Static method invokes constructor to allow avoiding 'new' keyword
  return new El(elOrSelector, unwrap);
}

El.make = function(tagName, options, unwrap = false){
  // Creates a new HTML Element, and wraps it for use by 'El' methods
  // Modifies it according to the 'options' argument
  // Returns the modified 'El' object (or the unwrapped Element 'unwrap' is true)
  let newEl = new El(document.createElement(tagName));
  if(options){
    // Classes
    if(options.class){
      newEl.addClass(options.class);
    }
    if(options.classes){
      options.classes.forEach(c => newEl.addClass(c));
    }
    if(options.attribute){
      // A single object with a single property
      let attribute = options.attribute;
      if(typeof attribute == "object" && Object.keys(attribute).length !== 0){
        let
          name = Object.keys(attribute)[0], // Keys beyond the first are ignored
          value = attribute[name];
        newEl.setAttribute(name, value);
      }
    }
    // Attributes
    if(options.attributes){
      // An array of objects, each with one property 
      options.attributes.forEach(a => {
        if(typeof a == "object" && Object.keys(a).length !== 0){
          let
            name = Object.keys(a)[0], // For each object, keys beyond the first are ignored
            value = a[name];
          newEl.setAttribute(name, value);
        }
      });
    }
    // Properties
    if(options.property){
      let property = options.property;
      // (`property` should hold a single object with a single property)
      if(typeof property == "object" && Object.keys(property).length !== 0){
        let
          name = Object.keys(property)[0], // Keys beyond the first are ignored
          value = property[name];
        newEl.setProperty(name, value);
      }
    }
    if(options.properties){
      // (`properties` should hold an array of objects, each with a single property)
      options.properties.forEach(p => {
        if(typeof p == "object" && Object.keys(p).length !== 0){
          let
            name = Object.keys(p)[0], // For each object, keys beyond the first are ignored
            value = p[name];
          newEl.setProperty(name, value);
        }
      });
    }
    // Direct access to style subproperties
    if(options.style){
      let styleProp = options.style;
      if(typeof styleProp == "object" && Object.keys(styleProp).length !== 0){
        let
          name = Object.keys(styleProp)[0],
          value = styleProp[name];
        newEl.setStyle(name, value);
      }
    }
    if(options.styles){
      options.styles.forEach(styleProp => {
        if(typeof styleProp == "object" && Object.keys(styleProp).length !== 0){
          let
            name = Object.keys(styleProp)[0],
            value = styleProp[name];
          newEl.setStyle(name, value);
        }
      });
    }
    // Direct access to dataset
    if(options.data){
      options.data.forEach(dataItem => {
        if(typeof dataItem == "object" && Object.keys(dataItem).length !== 0){
          let name = Object.keys(dataItem)[0],
            value = dataItem[name];
          newEl.el.dataset[name] = value;
        }
      });
    }

    // Direct access to id, innerHTML, and value
    if(options.html){ newEl.setProperty("innerHTML", options.html); }
    if(options.value){ newEl.setProperty("innerHTML", options.value); }
    if(options.id){ newEl.setAttribute("id", options.id); }
    if(options.children){
      options.children.forEach(childToMake => {
        if(typeof childToMake == "object" && Object.keys(childToMake).length !== 0){
          let
            tagName = Object.keys(childToMake)[0],
            options = childToMake[tagName],
            childNodeEl = El.make(tagName, options);
          newEl.el.appendChild(childNodeEl.el);
        }
      });
    }
    if(options.parent){
      //console.log(options.parent);
      let parent = El.from(options.parent).unwrap();
      parent.appendChild(newEl.unwrap());
    }
  }
  if(unwrap === true){ return newEl.el; }
  return newEl;
}

El.prototype.log = function(){ console.log(this.el); return this; }

El.prototype.unwrap = function(){
  // Unwraps an 'El' object to return a 'normal' HTML Element
  return this.el;
}

El.prototype.setStyle = function(styleProp, value, unwrap){
  // Sets the specified style subproperty on the wrapped object, and returns it
  //  (or returns the unwrapped Element if 'unwrap' is true)
  if(typeof styleProp == "string" && typeof value == "string"){
    try{ this.el.style[styleProp] = value; }
    catch{ console.log(`Couldn't set style ${styleProp} on ${this.el.tagName}`); }
  }
  if(unwrap === true){ return this.el; }
  return this;
}

El.prototype.addClass = function(className, unwrap){
  // Adds the specified class to the wrapped object, and returns it
  //  (or returns the unwrapped Element if 'unwrap' is true)
  if(typeof className == "string"){ this.el.classList.add(className); }
  if(unwrap === true){ return this.el; }
  return this;
}

El.prototype.setAttribute = function(attribute, value, unwrap){
  // Sets the specified attribute on the wrapped object, and returns it
  //  (or returns the unwrapped Element if 'unwrap' is true)
  if(typeof attribute == "string" && typeof value == "string"){
    try{ this.el.setAttribute(attribute, value); }
    catch{ console.log(`Couldn't set attribute ${attribute} on ${this.el.tagName}`); }
  }
  if(unwrap === true){ return this.el; }
  return this;
}

El.prototype.setProperty = function(property, value, unwrap){
  // Sets the specified property on the wrapped object, and returns it
  //  (or returns the unwrapped Element if 'unwrap' is true)
  if(typeof property == "string" && typeof value == "string"){
    try{ (this.el)[property] = value; }
    catch{ console.log(`Couldn't set property ${property} on ${this.el.tagName}`); }
  }
  if(unwrap === true){ return this.el; }
  return this;
}

El.prototype.appendTo = function(parentElOrSelector){
  let parentEl = El.from(parentElOrSelector);
  parentEl.unwrap().appendChild(this.unwrap());
  return this;
}

El.prototype.getParent = function(){
  let parent = this.unwrap().parentElement;
  return El.from(parent) || null;
}

function debugEl(testsArr){

  if(!testsArr){
    testsArr = [];
    // Tests that should successfully return Elements
    testsArr.push(document.getElementsByTagName("body")[0]); // body element
    testsArr.push(".somebody"); // selector for first element with "body" class 
    testsArr.push(document.createElement("DIV")); // new 'Div' element
    testsArr.push(El.make("DIV").el); // new 'Div' element constructed by `El.make`
    testsArr.push(El.make("custom-element").el); // new custom element constructed by `El.make`
    // Tests that should return undefined or null
    testsArr.push({ iAm: "notAnElement" }); // non-Element object (undefined)
    testsArr.push(".notAClass"); // selector for non-existent class (null)
    testsArr.push(document.querySelector(".notAClass")); // null selection (null)
  }

  printResult = () => {
    console.log("\ndebugEl:");
    for(let test of testsArr){ console.log(new El(test).el); }
    console.log("\n");
  }

  printResult();
}