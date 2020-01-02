function randomizeArray(arr){
  let i = arr.length;
  while(i > 0){
    let rand = Math.floor(Math.random() * i--);
    let temp = arr[i];
    arr[i] = arr[rand];
    arr[rand] = temp;
  }
  return arr;
}

function sortNumeric(arr, descending){
  return arr.sort( (a, b) =>
    (a - b) * (descending ? -1 : 1)
  );
}

function lastInArrayIfAny(arr){
  // Ensures that arr is array-like, otherwise returns undefined
  //   ie `length` property (enumerable or not) exists somewhere in arr's prototype chain 
  if(!(length in arr)){ return undefined; }
  // Ensures that arr includes at least one item, otherwise returns null  
  if(arr.length === 0){ return null; }
  // Both of the above tests passed, returns last item in arr
  return arr[arr.length - 1];
}

function charTags(char){
  // Called by toTitleCase
  const tags = {
    char: char,
    upper: char && char !== char.toLowerCase(),
    lower: char && char !== char.toUpperCase(),
    hyphen: char === "-",
    space: char === " ",
    delimiter: char === "-" || char === " "
  };
  return tags;
}

function toTitleCase(str){
  // Called by convertStringTo
  if(!str){ return ""; }
  let
    trimmed = str.trim(),
    initialCap = trimmed.slice(0, 1).toUpperCase() + trimmed.slice(1),
    chars = Array.from(initialCap);
  for(let i = 0; i < chars.length; i++){
    let
      curr = chars[i],
      prev = (i > 0) ? chars[i - 1] : null,
      currTags = charTags(curr),
      prevTags = charTags(prev)
    ;
    currTags.upperFollowsLower = prevTags.lower && currTags.upper;
    currTags.nonDelimiterFollowsDelimiter = prevTags.delimiter && !currTags.delimiter;
    currTags.spaceFollowsSpace = prevTags.space && currTags.space;
    //console.log("\n"); console.log(prevTags); console.log(currTags)
    
    if(currTags.upperFollowsLower){
      chars.splice(i, 0, " ");
      curr = chars[++i]; // Moves cursor to stay at the current character
      continue;
    }
    if(currTags.nonDelimiterFollowsDelimiter){
      //console.log(`nonDelimiterFollowsDelimiter at ${i} (${prev},${curr}` );
      chars[i - 1] = " ";
      chars[i] = curr.toUpperCase();
      prev = chars[i - 1]; // Merely updates prev to show modified value
      curr = chars[i]; // Merely updates curr to show modified value
      continue;
    }
    if(currTags.spaceFollowsSpace){
      chars.splice(i - 1, 1);
      curr = chars[--i]; // Moves cursor to stay at the current character
      continue;
    }
  }
  //console.log(chars.join(""));
  return chars.join("");
}

function convertStringTo(str, format){
  // Note: has trouble with kebab case if spaces and hypens are interspersed (eg 'my- - var`)
  if(!str){ return ""; }
  let titleCase = toTitleCase(str);
  if(format == "pascal"){ return titleCase.split(" ").join(""); }
  if(format == "lower"){ return titleCase.toLowerCase(); }
  if(format == "kebab"){ return titleCase.split(" ").join("-").toLowerCase(); }
}


// Testing
  function debugRandomizeArray(){
    //...
    console.log(randomizeArray([1,2,3,4,5,6,7]));
  }

  function debugToTitleCase(){
    const strings = ["bigFish", "BigFish", "big fish", "big-fish", "big-Fish", "  big  fish", "big fat fish", "big-fat-fish", "big--fat--fish", "big- - fat  - -fish", "big- - Fat  - -Fish", " Big      Fat      Fish "];
    for(let string of strings){
      console.log(`${string} --> ${toTitleCase(string)}` + "\n");
    }
  }

  function debugConvertStrings(){
    const strings = ["bigFish", "BigFish", "big fish", "big-fish", "big-Fish", "  big  fish", "big fat fish", "big-fat-fish", "big--fat--fish", "big- - fat  - -fish", "big- - Fat  - -Fish", " Big      Fat      Fish "];
    const formats = ["pascal", "lower", "kebab"];
    for(let format of formats){
      console.log(` ------ ${ format }: ------`);
      for(let string of strings){
        console.log(`${string} --> ${toTitleCase(string)} --> ${convertStringTo(string, format)}` + "\n");
      }
    }
  }
