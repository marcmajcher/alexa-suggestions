/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill');
var suggestions = require('./suggestions.js');

var APP_ID = 'amzn1.echo-sdk-ams.app.64192a57-0265-4d47-b130-ec637476758f'; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * ImprovSuggestions is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var ImprovSuggestions = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ImprovSuggestions.prototype = Object.create(AlexaSkill.prototype);
ImprovSuggestions.prototype.constructor = ImprovSuggestions;

ImprovSuggestions.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the imrov suggestion giver. You can ask a question like, can I have a suggestion for a location, occupation, or relationship?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

ImprovSuggestions.prototype.intentHandlers = {
    "SuggestionIntent": function (intent, session, response) {
        var typeSlot = intent.slots.SuggestionType,
            suggestionType;
        if (typeSlot && typeSlot.value){
            suggestionType = typeSlot.value.toLowerCase();
        }
        // else {
        // 	suggestionTypes = typeslot // get random type
        // }

        var cardTitle = "Suggestion for " + suggestionType,
            suggestion = suggestions[suggestionType][Math.floor(Math.random()*suggestions[suggestionType].length)],
            speechOutput,
            repromptOutput;

        if (suggestion) {
            speechOutput = {
                speech: suggestion,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, suggestion);
        } else {
            var speech;
            if (suggestionType) {
                speech = "I'm sorry, I currently do not have any suggestions for " + itemName + ". Try a location, occupation, or relationship.";
            } else {
                speech = "I'm sorry, I need a type of suggestion. Try a location, occupation, or relationship.";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What type of suggestion?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask for an improv suggestion, like a suggestion for a location, occupation, or relationship.";
        var repromptText = "You can say things like, can I have a suggestion for an occupation, can I get a relationship, or you can say exit... Now, what can I help you with?";
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
    var improvSuggestions = new ImprovSuggestions();
    improvSuggestions.execute(event, context);
};
