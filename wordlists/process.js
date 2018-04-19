// Node NOT browser
"use strict"

const fs = require("fs")
const directories = {
    "nouns" : "../db2/nouns.txt",
    "adverbs" : "../db2/adverbs.txt",
    "verbs" : "../db2/verbs.txt",
    "interjections" : "../db2/interjections.txt",
    "adjectives" : "../db/adjectives.txt"
}

Object.keys(directories).forEach(name => {
    let data = fs.readFileSync(directories[name], "utf8").split(/[\n\r]/g).filter(word => {
        return word != ""
    })
    data = JSON.stringify(data)
    //const file = data
// Seems dumb to store words globally when not imported
    // Access via window.WORDLISTS.nouns etc. or import * as WORDLISTS from ".."
    const file = `const WORDLISTS = ((typeof module !== "undefined" && module !== null) ? module.exports : void 0) || (window.WORDLISTS || (window.WORDSLISTS = {}))
WORDLISTS.${name} = ${data}`
    fs.writeFile(name+".js", file, () => {})
})