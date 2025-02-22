import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();
  // console.log(messages);
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: {
      // Example response:
      //   {
      //     "state": "result",
      //     "step": 0,
      //     "toolCallId": "call_ThnsABeCaSAxFgqPm0px73Dp",
      //     "toolName": "weather",
      //     "args": {
      //       "location": "Los Angeles, CA"
      //     },
      //     "result": {
      //       "location": "Los Angeles, CA",
      //       "temperature": 89
      //     }
      //   }
      weather: tool({
        description: "Get the weather in a location (fahrenheit)",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: "Convert a temperature in fahrenheit to celsius",
        parameters: z.object({
          temperature: z
            .number()
            .describe("The temperature in fahrenheit to convert"),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
