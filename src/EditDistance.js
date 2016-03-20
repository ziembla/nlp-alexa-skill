/**
    Copyright 2016 Wojciech Ziembla

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://www.apache.org/licenses/LICENSE-2.0

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict'

var DEBUG = false

var MAX_PHRASE_LENGTH = 200
var MIN_COST = 0
var MAX_COST = 25

// INFO: from oreilly's "JavaScript: The Good Parts" by Douglas Crockford
Array.matrix = function (m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
};

function isInteger(n) {
    return n === +n && n === (n|0);
}

module.exports = function(wordFrom, wordTo, insertionCost, deletionCost, substitutionCost) {
    if (DEBUG)
        console.log("computing distance between '" + wordFrom + "' and '" + wordTo + "'...")

    if (!wordFrom || !(typeof wordFrom == 'string' || wordFrom instanceof String) || wordFrom.length > MAX_PHRASE_LENGTH)
        throw "EditDistance exception - illegal wordFrom: '" + wordFrom + "'"
    if (!wordTo || !(typeof wordTo == 'string' || wordTo instanceof String) || wordTo.length > MAX_PHRASE_LENGTH)
        throw "EditDistance exception - illegal wordTo: '" + wordTo + "'"
    if (!isInteger(insertionCost) || insertionCost < MIN_COST || insertionCost > MAX_COST)
        throw "EditDistance exception - illegal insertionCost: " + insertionCost
    if (!isInteger(deletionCost) || deletionCost < MIN_COST || deletionCost > MAX_COST)
        throw "EditDistance exception - illegal deletionCost: " + deletionCost
    if (!isInteger(substitutionCost) || substitutionCost < MIN_COST || substitutionCost > MAX_COST)
        throw "EditDistance exception - illegal substitutionCost: " + substitutionCost

    var lF = wordFrom.length
    var lT = wordTo.length

    var costs = Array.matrix(lF + 1, lT + 1, 0)

    for (var t = 1; t <= lT; t++) // INFO: adding letter by letter
        costs[0][t] = costs[0][t - 1] + insertionCost
    for (var f = 1; f <= lF; f++) // INFO: removing letter by letter
        costs[f][0] = costs[f - 1][0] + deletionCost

    for (var f = 1; f <= lF; f++)
        for (var t = 1; t <= lT; t++)
        {
            var costD = costs[f - 1][t] + deletionCost
            var costI = costs[f][t - 1] + insertionCost
            var costS = costs[f - 1][t - 1] + (wordFrom.charAt(f - 1) == wordTo.charAt(t - 1) ? 0 : substitutionCost)

            costs[f][t] = Math.min(Math.min(costD, costI), costS)
        }

    if (DEBUG)
        console.log("computed  distance between '" + wordFrom + "' and '" + wordTo + "': " + costs[lF][lT])

    return costs[lF][lT]
};
