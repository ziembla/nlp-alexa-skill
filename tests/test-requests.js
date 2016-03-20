/**
    Copyright 2016 Wojciech Ziembla

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://www.apache.org/licenses/LICENSE-2.0

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict'

var lambda = require('../src/index')

var TEST_JSON_REGEX = /^request-.*\.jSon$/i

var FS = require("fs")
var PATH = require("path")

var Ctx = function () {
}
Ctx.prototype.succeed = function(o) {
    //console.log("succeed ")
    //console.log(o)
    console.log("------------------------------ " + o.response.outputSpeech.text)
}
Ctx.prototype.fail = function(o) {
    console.log("fail ")
    console.log(o)
}
var context = new Ctx()

console.log("\n\n\n")

var testJsonFiles = []
FS.readdirSync(__dirname).forEach(function(fileName) {
    if (TEST_JSON_REGEX.test(fileName))
        testJsonFiles.push(PATH.join(__dirname, fileName))
})
var testJsonFiles_count = testJsonFiles.length

for (var i = 0; i < testJsonFiles_count; i++) {
    var testFileName = testJsonFiles[i]
    console.log("\n---------- RUNNING " + PATH.basename(testFileName) + " ------------------------------")
    var event = require(testFileName)
    //console.log(event)
    console.log("------------------------------ " + event.request.intent.name)
    if (event.request.intent.slots.phraseA.value)
        console.log("------------------------------ " + event.request.intent.slots.phraseA.value)
    if (event.request.intent.slots.phraseB.value)
        console.log("------------------------------ " + event.request.intent.slots.phraseB.value)
    lambda.handler(event, context)
}

console.log("The End")
