const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Helper function to create an Alexa request
function createAlexaRequest(type, intentName = null, slots = {}) {
  const request = {
    version: '1.0',
    session: {
      new: true,
      sessionId: 'test-session-123',
      application: {
        applicationId: 'test-app-id'
      },
      user: {
        userId: 'test-user-123'
      }
    },
    request: {}
  };

  if (type === 'LaunchRequest') {
    request.request = {
      type: 'LaunchRequest',
      requestId: 'test-request-' + Date.now(),
      timestamp: new Date().toISOString(),
      locale: 'en-US'
    };
  } else if (type === 'IntentRequest') {
    request.request = {
      type: 'IntentRequest',
      requestId: 'test-request-' + Date.now(),
      timestamp: new Date().toISOString(),
      locale: 'en-US',
      intent: {
        name: intentName,
        confirmationStatus: 'NONE',
        slots: {}
      }
    };

    // Add slots
    for (const [slotName, slotValue] of Object.entries(slots)) {
      request.request.intent.slots[slotName] = {
        name: slotName,
        value: slotValue,
        confirmationStatus: 'NONE',
        source: 'USER'
      };
    }
  }

  return request;
}

// Test function
async function testSkill() {
  console.log('🧪 Testing Bin Calendar Alexa Skill\n');

  try {
    // Test 1: Launch Request (First time)
    console.log('Test 1: Launch Request (First Time Setup)');
    const launchRequest = createAlexaRequest('LaunchRequest');
    const launchResponse = await axios.post(`${BASE_URL}/alexa`, launchRequest);
    console.log('Response:', launchResponse.data.response.outputSpeech.ssml);
    console.log('✅ Launch request successful\n');

    // Test 2: Set Bin Day
    console.log('Test 2: Set Bin Day to Monday');
    const binDayRequest = createAlexaRequest('IntentRequest', 'BinDayIntent', { day: 'monday' });
    const binDayResponse = await axios.post(`${BASE_URL}/alexa`, binDayRequest);
    console.log('Response:', binDayResponse.data.response.outputSpeech.ssml);
    console.log('✅ Bin day set successfully\n');

    // Test 3: Set Schedule Weeks
    console.log('Test 3: Set Schedule to 2 weeks');
    const scheduleRequest = createAlexaRequest('IntentRequest', 'ScheduleWeeksIntent', { weeks: '2' });
    const scheduleResponse = await axios.post(`${BASE_URL}/alexa`, scheduleRequest);
    console.log('Response:', scheduleResponse.data.response.outputSpeech.ssml);
    console.log('✅ Schedule weeks set successfully\n');

    // Test 4: Set Bins for Week 1
    console.log('Test 4: Set bins for week 1');
    const setBins1Request = createAlexaRequest('IntentRequest', 'SetBinsIntent', { bins: 'recycling and general waste' });
    const setBins1Response = await axios.post(`${BASE_URL}/alexa`, setBins1Request);
    console.log('Response:', setBins1Response.data.response.outputSpeech.ssml);
    console.log('✅ Week 1 bins set successfully\n');

    // Test 5: Set Bins for Week 2
    console.log('Test 5: Set bins for week 2');
    const setBins2Request = createAlexaRequest('IntentRequest', 'SetBinsIntent', { bins: 'green waste and general waste' });
    const setBins2Response = await axios.post(`${BASE_URL}/alexa`, setBins2Request);
    console.log('Response:', setBins2Response.data.response.outputSpeech.ssml);
    console.log('✅ Week 2 bins set successfully\n');

    // Test 6: Check which bins this week
    console.log('Test 6: Check which bins this week');
    const checkBinsRequest = createAlexaRequest('IntentRequest', 'CheckBinsIntent', {});
    const checkBinsResponse = await axios.post(`${BASE_URL}/alexa`, checkBinsRequest);
    console.log('Response:', checkBinsResponse.data.response.outputSpeech.ssml);
    console.log('✅ Check bins successful\n');

    // Test 7: Help Intent
    console.log('Test 7: Help Intent');
    const helpRequest = createAlexaRequest('IntentRequest', 'AMAZON.HelpIntent', {});
    const helpResponse = await axios.post(`${BASE_URL}/alexa`, helpRequest);
    console.log('Response:', helpResponse.data.response.outputSpeech.ssml);
    console.log('✅ Help intent successful\n');

    // Test 8: Health Check
    console.log('Test 8: Health Check Endpoint');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('Response:', JSON.stringify(healthResponse.data, null, 2));
    console.log('✅ Health check successful\n');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests
testSkill().then(() => {
  console.log('\n✨ Test suite completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Test suite failed:', error);
  process.exit(1);
});
