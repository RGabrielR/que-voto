import { housingResults } from "models/housing-result";

// Function to populate the schema with a delay
async function populateSchemaWithDelay() {
  try {
    const maxExecutions = 60; // Number of times to execute
    const delayBetweenExecutions = 40000; // 40-second delay (adjust as needed)

    for (let i = 0; i < maxExecutions; i++) {
      await housingResults.populateOneResult();
      console.log(`Execution ${i + 1} completed.`);
      if (i < maxExecutions - 1) {
        // Delay between executions, except for the last one
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenExecutions)
        );
      }
    }

    console.log("All executions completed.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Start the population process
populateSchemaWithDelay();
