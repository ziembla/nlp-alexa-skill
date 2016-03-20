/**
    Copyright 2016 Wojciech Ziembla
    (based on sample MinecraftHelper skill)

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://www.apache.org/licenses/LICENSE-2.0

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';

var DEBUG = false

var AlexaSkill = require('./AlexaSkill'),
    editDistance = require('./EditDistance');

var APP_ID = "amzn1.echo-sdk-ams.app.85dede7b-62f5-4f60-bb39-58ad5715ce3c";

var NLPSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

NLPSkill.prototype = Object.create(AlexaSkill.prototype);
NLPSkill.prototype.constructor = NLPSkill;

NLPSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the NLP. You can ask about edit distance between two words. You can say for example, Give me the edit distance between words dog and cat... Now, what can I do for you?";
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

function handleEditDistance(intent, session, response) {
        var phraseASlot = intent.slots.phraseA,
            phraseAValue;
        if (phraseASlot && phraseASlot.value)
            phraseAValue = phraseASlot.value.toLowerCase();

        var phraseBSlot = intent.slots.phraseB,
            phraseBValue;
        if (phraseBSlot && phraseBSlot.value)
            phraseBValue = phraseBSlot.value.toLowerCase();

        if (DEBUG)
            console.log("computing distance between '" + phraseAValue + "' and '" + phraseBValue + "'...");

        if (phraseAValue && phraseBValue) {
            var cardTitle = "Edit distance between '" + phraseAValue + "' and '" + phraseBValue + "'";
            var distance = editDistance(phraseAValue, phraseBValue, 1, 1, 2);
            var speech = (cardTitle + " is " + distance).toLowerCase();

            var likeness = 1 - distance / (phraseAValue.length + phraseBValue.length); // INFO: assuming insertion and substitution costs of 1 (above)

            if (DEBUG)
                console.log("edit distance: " + distance + ", likeness: " + likeness);

            if (intent.name == "IsLike") {
                if (likeness > .75)
                    speech = "yes, they are alike, because " + speech;
                else if (likeness > .5)
                    speech = "well, they are quite alike, because " + speech;
                else
                    speech = "no, they are quite different... " + speech;
            }
            else if (intent.name == "WhyLike") {
                if (likeness > .75)
                    speech = "they are alike, because " + speech;
                else if (likeness > .5)
                    speech = "well, they are not so similar... " + speech;
                else
                    speech = "well, they are not alike... " + speech;
            }

            var speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, speech);
        } else {
            var speechOutput = {
                speech: "I'm sorry, I didn't understand something you've said. Could you repeat your question?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            var repromptOutput = {
                speech: "What else can I do for you?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
}

NLPSkill.prototype.intentHandlers = {
    "EditDistance": handleEditDistance,
    "IsLike": handleEditDistance,
    "WhyLike": handleEditDistance,

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask about edit distance between two words. You can say for example, Give me the edit distance between words dog and cat... Now, what can I do for you?";
        var repromptText = "You can say for example, Give me the edit distance between words dragon and tree... Now, what can I do for you?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var nlpSkill = new NLPSkill();
    nlpSkill.execute(event, context);
};
