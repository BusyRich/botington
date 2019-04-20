

 // Regular Expression used to capture data replacements.
const capture = /({[a-z0-9\.]+})/gi;

/*
 * Function that formats a string with the given data.
 */
module.exports = function(text, ...data) {
  let str = text;
  if (str && data.length) {
    let args = data.length > 1 ? data : data[0],
        matches = str.match(capture);

    for(let m in matches) {
      let replacement = matches[m].slice(1, -1),
          value;
          
      if(replacement.indexOf('.') > -1) {
        replacement = replacement.split('.');
        
        for(let p in replacement) {
          value = (p == 0 ? args[replacement[p]] : value[replacement[p]]) || matches[m];
        }
      } else {
        value = args[replacement];
      }
      
      if(value != undefined && value != null) {
        str = str.replace(matches[m], value);
      }
    }
  }

  return str;
};