# Bin Calendar - Alexa Skill

An Alexa Skill to keep track of which bins you should put out this week. This skill helps you manage your bin collection schedule and reminds you which bins to put out each week based on your personalized schedule.

## Features

### First-Time Setup
When you first use the skill, it will guide you through a setup process:
1. **Bin Collection Day**: Tell Alexa which day of the week your bins are collected (e.g., Monday, Tuesday)
2. **Schedule Length**: Specify how many weeks your bin collection schedule runs (1-6 weeks)
3. **Bin Types per Week**: For each week in your schedule, tell Alexa which bins are collected (e.g., "recycling and general waste", "green waste and recycling")

### After Setup
Once configured, you can ask:
- "Alexa, ask Bin Calendar what bins are being collected this week"
- "Alexa, ask Bin Calendar which bins this week"
- "Alexa, ask Bin Calendar what bins should I put out"

The skill will tell you which bins to put out based on your current week in the schedule.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/adamhale-exe/bincalendar.git
cd bincalendar
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## Server Endpoints

- **POST /alexa**: The main endpoint for Alexa skill requests
- **GET /health**: Health check endpoint that returns server status

## Hosting

This skill is designed to be self-hosted (no AWS Lambda or S3 required). You can host it on any server with Node.js support:

1. Deploy the application to your server
2. Set up HTTPS (required by Alexa)
3. Configure your Alexa Skill in the Amazon Developer Console:
   - Set the endpoint to your server's URL (e.g., https://yourdomain.com/alexa)
   - Upload the interaction model from `interaction-model.json`

## Interaction Model

The `interaction-model.json` file contains the Alexa skill's interaction model, including:
- Invocation name: "bin calendar"
- Custom intents for setup and querying
- Sample utterances for natural language understanding

To use this in your Alexa Developer Console:
1. Create a new Alexa Skill
2. Go to the "Build" tab
3. Select "JSON Editor" in the left sidebar
4. Copy and paste the contents of `interaction-model.json`
5. Save and build the model

## Data Storage

Currently, the skill uses in-memory storage for user data. For production use, you should implement persistent storage using a database (e.g., MongoDB, PostgreSQL, DynamoDB) to ensure user data persists across server restarts.

## Usage Examples

### Initial Setup Flow
1. **User**: "Alexa, open Bin Calendar"
2. **Alexa**: "Welcome to Bin Calendar! Let's set up your bin collection schedule. Which day of the week are your bins collected?"
3. **User**: "Monday"
4. **Alexa**: "Got it, your bins are collected on Monday. Now, how many weeks is your bin collection schedule?"
5. **User**: "Two weeks"
6. **Alexa**: "Great! You have a 2 week schedule. Now let's set up which bins are collected each week. For week 1, which bins are collected?"
7. **User**: "Recycling and general waste"
8. **Alexa**: "Week 1 set with recycling and general waste. Now, for week 2, which bins are collected?"
9. **User**: "Green waste and general waste"
10. **Alexa**: "Perfect! Your bin collection schedule is now complete. You can now ask me what bins are being collected this week."

### Checking Bins
1. **User**: "Alexa, ask Bin Calendar what bins this week"
2. **Alexa**: "This week, on Monday, the following bins will be collected: recycling and general waste. That's in 3 days."

## Development

### Project Structure
```
bincalendar/
├── index.js                   # Main application file with skill logic
├── interaction-model.json     # Alexa skill interaction model
├── package.json              # Node.js dependencies and scripts
└── README.md                 # This file
```

### Key Components

- **LaunchRequestHandler**: Handles skill launch and determines if setup is needed
- **BinDayIntentHandler**: Captures the day bins are collected
- **ScheduleWeeksIntentHandler**: Captures the schedule length (1-6 weeks)
- **SetBinsIntentHandler**: Captures which bins are collected for each week
- **CheckBinsIntentHandler**: Answers "what bins this week" queries
- **Helper Functions**:
  - `getCurrentWeekInCycle()`: Calculates which week in the schedule we're currently in
  - `getDaysUntilBinDay()`: Calculates days until next bin collection

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
