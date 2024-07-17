const checkNaughtyStrings = (req, res, next) => {
    const checkStrings = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkStrings(obj[key]); // Recursively check nested objects
        } else if (typeof obj[key] === 'string') {
          for (const naughtyString of naughtyStrings) {
            if (obj[key].includes(naughtyString)) {
              return true;
            }
          }
        }
      }
      return false;
    };
  
    if (checkStrings(req.body) || checkStrings(req.query) || checkStrings(req.params)) {
      return res.status(400).send('Bad request: contains naughty strings.');
    }
  
    next();
  }

module.exports = {checkNaughtyStrings}