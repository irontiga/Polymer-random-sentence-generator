"use strict"

import WORDLISTS from "./wordlists/wordlists.js"

/**
 * `random-sentence-generator`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RandomSentenceGenerator extends Polymer.Element {
    static get is() { return 'random-sentence-generator' }

    static get properties() {
        return {
            template: {
                type: String,
                value: "adjective noun verb adverb."
            },
            parsedString:{
                computed: "parse(template)"
            },
            fetchedWordlistCount: {
                type: Number,
                value: 0
            },
            capitalize: {
                type: Boolean,
                value: true
            },
            partsOfSpeechMap: {
                type: Object,
                value: {
                    "noun" : "nouns",
                    "adverb" : "adverbs",
                    "adv" : "adverbs",
                    "verb" : "verbs",
                    "interjection": "interjections",
                    "adjective" : "adjectives"
                }
            }
        }
    }

    constructor(){
        super()

        this.partsOfSpeech = Object.keys(this.partsOfSpeechMap)
        
    }
    /**
            * entropy in bits
            */
    _RNG(entropy){
        if(entropy > 1074){
            throw "Javascript can not handle that much entropy!"
        }
        let randNum = 0
        const crypto = window.crypto || window.msCrypto

        if(crypto){
            const entropy256 = Math.ceil(entropy / 8)

            let buffer = new Uint8Array(entropy256)
            crypto.getRandomValues(buffer)

            randNum = buffer.reduce((num, value) => {
                return num * value
            }, 1) / Math.pow(256, entropy256)

        } else {
            console.warn("Secure RNG not found. Using Math.random")
            randNum = Math.random()
        }
        return randNum
    }

    setRNG(fn){
        this._RNG = fn
    }
    
    _captitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    
    getWord(partOfSpeech){
        const words = WORDLISTS[this.partsOfSpeechMap[partOfSpeech]]
        const requiredEntropy = Math.log(words.length) / Math.log(2)
        const index = this._RNG(requiredEntropy) * words.length
        
        return words[Math.floor(index)]
    }

    parse(template){
        const split = template.split(/[\s]/g)

        const final = split.map(word => {

            const lower = word.toLowerCase()

            this.partsOfSpeech.some(partOfSpeech => {

                const partOfSpeechIndex = lower.indexOf(partOfSpeech)
                const nextChar = word.charAt(partOfSpeech.length)
                
                if(partOfSpeechIndex == 0 && !(nextChar && (nextChar.match(/[a-zA-Z]/g) != null))){
                    word = this.getWord(partOfSpeech) + word.slice(partOfSpeech.length)
                    return true
                }
            })
            return word
        })
        return final.join(" ")
    }
}

window.customElements.define(RandomSentenceGenerator.is, RandomSentenceGenerator);