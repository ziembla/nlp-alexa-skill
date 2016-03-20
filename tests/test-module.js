/**
    Copyright 2016 Wojciech Ziembla

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://www.apache.org/licenses/LICENSE-2.0

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

// regex for searching: \t|( +$)
//		test of TABs
//      test of trailing spaces     

'use strict'

var editDistance = require('../src/EditDistance')

var TESTS = [
    [   "a",    "aaa",                  2 ],
    [   "b",    "a",                    2 ],
    [   "ab",   "ba",                   2 ],

    [   "ba",   "ala",                  3 ],
    [   "ala",  "ba",                   3 ],

    [   "ba",   "ala",      1, 1, 1,    2 ],

    [   "a",    "b",        5, 7, 19,   12 ],
    [   "aaa",  "a",        5, 7, 19 ,  14],
    [   "a",    "aaaaa",    5, 7, 19 ,  20],
    [   "",     "aa",       5, 7, 19,   "illegal wordFrom: ''" ], // INFO: empty string illegal in our scenario (could be allowed?)

    [   "ba",   "ala",      5, 7, 0,    5 ],
    [   "ala",  "ba",       5, 7, 0,    7 ],

    [   "",     "",                     "illegal wordFrom: ''" ],
    [  3, 3,                            "illegal wordFrom: '3'" ],
    [  "abc", "abc",                    0 ]
]
var TESTS_COUNT = TESTS.length

var DEFAULT_COSTS = [ 1, 1, 2 ]

var pass = 0
var fail = 0

var PADDING_STRING = "                         "
var PADDING_STRING_LENGTH = PADDING_STRING.length
var PADDING_LENGTH = 10

function getRightPadedText(text, length) {
    var padded = [ "'", text, "'", PADDING_STRING ].join("")
    if (length > PADDING_STRING_LENGTH || padded.length - PADDING_STRING_LENGTH > length)
        throw "illegal padding request"
    return padded.slice(0, length)
}
function getLeftPadedText(text, length) {
    var padded = [ PADDING_STRING, "'", text, "'" ].join("")
    if (length > PADDING_STRING_LENGTH || padded.length - PADDING_STRING_LENGTH > length)
        throw "illegal padding request"
    return padded.slice(-length)
}

for (var i = 0; i < TESTS_COUNT; i++) {
    var distance = TESTS[i].pop()
    var phrases = [TESTS[i].shift(), TESTS[i].shift()]
    var costs = TESTS[i].length == 3 ? TESTS[i] : DEFAULT_COSTS

    var result = null
    try {
        result = editDistance.apply(null, phrases.concat(costs))
    } catch (e) {
        result = e.toString().replace("EditDistance exception - ", "")
    }

    var report = [ "  ", getLeftPadedText(phrases[0], PADDING_LENGTH), " vs. ", getRightPadedText(phrases[1], PADDING_LENGTH), " -> ", result ]
    if (result == distance) {
        pass++
        report.unshift("pass")
    }
    else {
        fail++
        report.unshift("FAIL")
        report.push(" (expected ", distance, ")")
    }
    console.log(report.join(""))
}

var report = [ "-----" ]
if (pass) {
    report.push( "\npassed: ", pass )
    if (!fail)
        report.push( " (ALL!)" )
}
if (fail) {
    report.push( "\nfailed: ", fail )
    if (!pass)
        report.push( " (ALL ERRORS!)" )
}
console.log(report.join(""))
