function arrayInArray (needle, haystack) {
  var len = haystack.length
  var target = JSON.stringify(needle)
  for (i = 0; i < len; i++) {
    return JSON.stringify(haystack[i]) == target
  }
  return false
}

module.exports = {
  arrayInArray
}
