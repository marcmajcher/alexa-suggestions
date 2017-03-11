'use strict';

/* eslint-env node */

const AlexaSkill = require('./AlexaSkill');
const suggestions = require('./suggestions.js');
const outputPrefix = 'Your suggestion is';

const APP_ID = 'amzn1.echo-sdk-ams.app.64192a57-0265-4d47-b130-ec637476758f';

/**
 * ImprovSuggestions is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
function ImprovSuggestions() {
  AlexaSkill.call(this, APP_ID);
}

// Extend AlexaSkill
ImprovSuggestions.prototype = Object.create(AlexaSkill.prototype);
ImprovSuggestions.prototype.constructor = ImprovSuggestions;

ImprovSuggestions.prototype.eventHandlers.onLaunch = (launchRequest, session, response) => {
  const speechText = 'Welcome to the improv suggestifier. You can ask a question like, can I have a suggestion for a location, occupation, or relationship?';
  const repromptText = 'For instructions on what you can say, please say help me.';
  response.ask(speechText, repromptText);
};

ImprovSuggestions.prototype.intentHandlers = {
  SuggestionIntent: (intent, session, response) => {
    const typeSlot = intent.slots.SuggestionType;
    let suggestionType;
    if (typeSlot && typeSlot.value) {
      suggestionType = typeSlot.value.toLowerCase();
    }

    const cardTitle = `Suggestion for ${suggestionType}`;
    const suggestionList = suggestions[suggestionType];
    const suggestion = suggestionList ?
      suggestionList[Math.floor(Math.random() * suggestionList.length)] :
      undefined;
    let speechOutput;
    let repromptOutput;

    if (suggestion) {
      speechOutput = {
        speech: `${outputPrefix} ${suggestion}`,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      response.tellWithCard(speechOutput, cardTitle, suggestion);
    }
    else {
      let speech;
      if (suggestionType) {
        speech = `I'm sorry, I currently do not have any suggestions for ${suggestionType}. Try a location, occupation, or relationship.`;
      }
      else {
        speech = 'I\'m sorry, I need a type of suggestion. Try a location, occupation, or relationship.';
      }
      speechOutput = {
        speech,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      repromptOutput = {
        speech: 'What type of suggestion?',
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      response.ask(speechOutput, repromptOutput);
    }
  },

  'AMAZON.StopIntent': (intent, session, response) => {
    response.tell('Goodbye');
  },

  'AMAZON.CancelIntent': (intent, session, response) => {
    response.tell('Goodbye');
  },

  'AMAZON.HelpIntent': (intent, session, response) => {
    const speechText = 'You can ask for an improv suggestion, like a suggestion for a location, occupation, or relationship.';
    const repromptText = 'You can say things like, can I have a suggestion for an occupation, can I get a relationship, or you can say exit... Now, what can I help you with?';
    const speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    const repromptOutput = {
      speech: repromptText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.ask(speechOutput, repromptOutput);
  }
};

exports.handler = (event, context) => {
  const improvSuggestions = new ImprovSuggestions();
  improvSuggestions.execute(event, context);
};
