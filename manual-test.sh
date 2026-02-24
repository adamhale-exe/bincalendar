#!/bin/bash

# Manual Test Suite for Bin Calendar Alexa Skill
# This script demonstrates all the key features

echo "======================================"
echo "Bin Calendar - Manual Test Scenarios"
echo "======================================"
echo ""

echo "Test Scenario 1: First-time user setup"
echo "--------------------------------------"
echo "Simulating: User opens skill for first time"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "new": true,
      "sessionId": "manual-test-1",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "LaunchRequest",
      "requestId": "req-1",
      "timestamp": "2026-02-24T00:00:00Z",
      "locale": "en-US"
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "Test Scenario 2: Setting bin collection day"
echo "--------------------------------------------"
echo "User says: 'Wednesday'"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "sessionId": "manual-test-1",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "req-2",
      "intent": {
        "name": "BinDayIntent",
        "slots": {
          "day": {"name": "day", "value": "wednesday"}
        }
      }
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "Test Scenario 3: Setting schedule to 3 weeks"
echo "---------------------------------------------"
echo "User says: 'Three weeks'"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "sessionId": "manual-test-1",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "req-3",
      "intent": {
        "name": "ScheduleWeeksIntent",
        "slots": {
          "weeks": {"name": "weeks", "value": "3"}
        }
      }
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "Test Scenario 4: Setting bins for week 1"
echo "-----------------------------------------"
echo "User says: 'Recycling and general waste'"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "sessionId": "manual-test-1",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "req-4",
      "intent": {
        "name": "SetBinsIntent",
        "slots": {
          "bins": {"name": "bins", "value": "recycling and general waste"}
        }
      }
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "Test Scenario 5: Setting bins for week 2"
echo "-----------------------------------------"
echo "User says: 'General waste only'"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "sessionId": "manual-test-1",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "req-5",
      "intent": {
        "name": "SetBinsIntent",
        "slots": {
          "bins": {"name": "bins", "value": "general waste only"}
        }
      }
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "Test Scenario 6: Setting bins for week 3"
echo "-----------------------------------------"
echo "User says: 'Green waste and general waste'"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "sessionId": "manual-test-1",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "req-6",
      "intent": {
        "name": "SetBinsIntent",
        "slots": {
          "bins": {"name": "bins", "value": "green waste and general waste"}
        }
      }
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "Test Scenario 7: Checking which bins this week"
echo "-----------------------------------------------"
echo "User asks: 'What bins are being collected this week?'"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "sessionId": "manual-test-1",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "req-7",
      "intent": {
        "name": "CheckBinsIntent",
        "slots": {}
      }
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "Test Scenario 8: Returning user (already configured)"
echo "----------------------------------------------------"
echo "User opens skill again"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "new": true,
      "sessionId": "manual-test-2",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "LaunchRequest",
      "requestId": "req-8",
      "timestamp": "2026-02-24T00:00:00Z",
      "locale": "en-US"
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "Test Scenario 9: Help request"
echo "------------------------------"
echo "User asks for help"
curl -s -X POST http://localhost:3000/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "sessionId": "manual-test-2",
      "user": {"userId": "manual-user-1"}
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "req-9",
      "intent": {
        "name": "AMAZON.HelpIntent",
        "slots": {}
      }
    }
  }' | jq -r '.response.outputSpeech.ssml'
echo ""

echo ""
echo "======================================"
echo "All manual tests completed!"
echo "======================================"
