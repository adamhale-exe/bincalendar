const Alexa = require('ask-sdk-core');
const express = require('express');
const app = express();

// In-memory storage for user data (replace with database in production)
const userData = {};

// Helper function to get current week number based on start date
function getCurrentWeekInCycle(startDate, scheduleWeeks) {
  const now = new Date();
  const start = new Date(startDate);
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(diffDays / 7);
  return (weeksPassed % scheduleWeeks) + 1;
}

// Helper function to get days until next bin day
function getDaysUntilBinDay(binDay) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  const currentDay = today.getDay();
  const targetDay = days.indexOf(binDay.toLowerCase());
  
  if (targetDay === -1) return -1;
  
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) {
    daysUntil += 7;
  }
  
  return daysUntil;
}

// Launch Request Handler - First time setup
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.session.user.userId;
    
    if (!userData[userId] || !userData[userId].setupComplete) {
      const speakOutput = 'Welcome to Bin Calendar! Let\'s set up your bin collection schedule. Which day of the week are your bins collected? For example, you can say Monday, Tuesday, or any day of the week.';
      
      // Initialize user data
      if (!userData[userId]) {
        userData[userId] = {
          setupComplete: false,
          setupStep: 'binDay'
        };
      }
      
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    } else {
      const speakOutput = 'Welcome back to Bin Calendar! You can ask me what bins are being collected this week, or say help for more options.';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt('What would you like to know?')
        .getResponse();
    }
  }
};

// Bin Day Intent Handler
const BinDayIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BinDayIntent';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.session.user.userId;
    const binDay = Alexa.getSlotValue(handlerInput.requestEnvelope, 'day');
    
    if (!userData[userId]) {
      userData[userId] = {};
    }
    
    userData[userId].binDay = binDay;
    userData[userId].setupStep = 'scheduleWeeks';
    
    const speakOutput = `Got it, your bins are collected on ${binDay}. Now, how many weeks is your bin collection schedule? It can be between 1 and 6 weeks.`;
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt('How many weeks is your bin collection schedule?')
      .getResponse();
  }
};

// Schedule Weeks Intent Handler
const ScheduleWeeksIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ScheduleWeeksIntent';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.session.user.userId;
    const weeks = parseInt(Alexa.getSlotValue(handlerInput.requestEnvelope, 'weeks'));
    
    if (!userData[userId]) {
      userData[userId] = {};
    }
    
    if (weeks < 1 || weeks > 6) {
      const speakOutput = 'Please provide a number between 1 and 6 weeks.';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
    
    userData[userId].scheduleWeeks = weeks;
    userData[userId].currentWeekSetup = 1;
    userData[userId].weeklyBins = {};
    userData[userId].setupStep = 'setBins';
    userData[userId].setupStartDate = new Date().toISOString();
    
    const speakOutput = `Great! You have a ${weeks} week schedule. Now let's set up which bins are collected each week. For week 1, which bins are collected? For example, you can say recycling and general waste, or just recycling.`;
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt('Which bins are collected in week 1?')
      .getResponse();
  }
};

// Set Bins Intent Handler
const SetBinsIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetBinsIntent';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.session.user.userId;
    const bins = Alexa.getSlotValue(handlerInput.requestEnvelope, 'bins');
    
    if (!userData[userId]) {
      return handlerInput.responseBuilder
        .speak('Please start by setting up your bin collection day first.')
        .getResponse();
    }
    
    const currentWeek = userData[userId].currentWeekSetup;
    userData[userId].weeklyBins[currentWeek] = bins;
    
    if (currentWeek < userData[userId].scheduleWeeks) {
      userData[userId].currentWeekSetup = currentWeek + 1;
      const speakOutput = `Week ${currentWeek} set with ${bins}. Now, for week ${currentWeek + 1}, which bins are collected?`;
      
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(`Which bins are collected in week ${currentWeek + 1}?`)
        .getResponse();
    } else {
      userData[userId].setupComplete = true;
      const speakOutput = `Perfect! Your bin collection schedule is now complete. You can now ask me what bins are being collected this week.`;
      
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  }
};

// Check Bins Intent Handler
const CheckBinsIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckBinsIntent';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.session.user.userId;
    
    if (!userData[userId] || !userData[userId].setupComplete) {
      const speakOutput = 'You need to complete the setup first. Please say start setup to begin.';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt('Say start setup to configure your bin collection schedule.')
        .getResponse();
    }
    
    const currentWeek = getCurrentWeekInCycle(userData[userId].setupStartDate, userData[userId].scheduleWeeks);
    const bins = userData[userId].weeklyBins[currentWeek];
    const binDay = userData[userId].binDay;
    const daysUntil = getDaysUntilBinDay(binDay);
    
    let speakOutput;
    if (daysUntil === 0) {
      speakOutput = `Today is bin day! The following bins are being collected: ${bins}.`;
    } else if (daysUntil === 1) {
      speakOutput = `Tomorrow is bin day! The following bins will be collected: ${bins}.`;
    } else {
      speakOutput = `This week, on ${binDay}, the following bins will be collected: ${bins}. That's in ${daysUntil} days.`;
    }
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

// Help Intent Handler
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.session.user.userId;
    
    let speakOutput;
    if (!userData[userId] || !userData[userId].setupComplete) {
      speakOutput = 'Bin Calendar helps you track which bins to put out each week. First, tell me which day your bins are collected, then how many weeks your schedule is, and finally which bins are collected each week. Let\'s start with the day. Which day are your bins collected?';
    } else {
      speakOutput = 'You can ask me what bins are being collected this week. I\'ll tell you which bins to put out based on your schedule. What would you like to know?';
    }
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// Cancel and Stop Intent Handler
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

// Session Ended Request Handler
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  }
};

// Error Handler
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// Skill Builder
const skillBuilder = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    BinDayIntentHandler,
    ScheduleWeeksIntentHandler,
    SetBinsIntentHandler,
    CheckBinsIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .create();

// Express middleware
app.use(express.json());

// Alexa skill endpoint
app.post('/alexa', async (req, res) => {
  try {
    const response = await skillBuilder.invoke(req.body);
    res.json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bin Calendar Alexa Skill server running on port ${PORT}`);
  console.log(`Alexa endpoint: http://localhost:${PORT}/alexa`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
