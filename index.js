#!/usr/bin/env node

import Gemini from "gemini-ai";
import readline from "readline";
import fs from "fs-extra";
import { createSpinner } from "nanospinner";
import path from "path";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import gradient from "gradient-string";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

const API_KEY = "AIzaSyD_KK1K9tnIUs4ezasve0VlZcVdbgL8Taw";

// Function to format the bot's response
const formatBotResponse = (response) => {
  return response
    .replace(/\*\*(.*?)\*\*/g, chalk.bold("$1")) // Bold text
    .replace(/\*(.*?)\*/g, chalk.italic("$1")); // Italic text
};

// Function to start the chat session
const startChatSession = async (chat, rl) => {
  const askQuestion = () => {
    rl.question(chalk.cyan("You 👤: "), async (userQuestion) => {
      if (userQuestion.toLowerCase() === "exit") {
        console.log(gradient.rainbow("Exiting chat. Have a great day!"));
        rl.close();
        return;
      }
      try {
        const spinner = createSpinner("Thinking...").start();
        const response = await chat.ask(userQuestion);
        spinner.success({
          text: chalk.green(`Bot 🤖: ${formatBotResponse(response)}\n`),
        });
      } catch (error) {
        console.error(chalk.red("Error fetching the answer:"), error.message);
      }

      // Continue the chat loop
      askQuestion();
    });
  };

  askQuestion();
};

// Function to handle mood check
const handleMoodCheck = (rl, chat) => {
  rl.question(
    chalk.magenta("How are you feeling today? (good/sad/neutral): "),
    async (mood) => {
      switch (mood.toLowerCase()) {
        case "good":
          console.log(
            chalk.greenBright(
              "Bot 🤖: I’m glad to hear that! Let’s have a great conversation!\n"
            )
          );
          break;
        case "sad":
          rl.question(
            chalk.yellowBright(
              "Bot 🤖: I’m sorry to hear that. What happened? I’m here to help you.\nYou: "
            ),
            async (reason) => {
              try {
                const spinner = createSpinner("Thinking...").start();
                const response = await chat.ask(reason);
                spinner.success({
                  text: chalk.green(`Bot 🤖: ${formatBotResponse(response)}\n`),
                });
              } catch (error) {
                console.error(
                  chalk.red("Error fetching the answer:"),
                  error.message
                );
              }
              // Proceed to chat session
              startChatSession(chat, rl);
            }
          );
          return; // Exit the switch early to prevent immediate chat start
        case "neutral":
          console.log(
            chalk.blueBright(
              "Bot 🤖: It’s okay to feel neutral. Let’s see if we can brighten your day!\n"
            )
          );
          break;
        default:
          console.log(
            chalk.redBright(
              "Bot 🤖: Hmm, I’m not sure how to respond to that, but I’m here for you.\n"
            )
          );
          break;
      }

      // Start the chat session
      startChatSession(chat, rl);
    }
  );
};

// Main function to run the CLI
const main = async () => {
  
  const rainbow = chalkAnimation.rainbow(`
  
░██████╗██╗░░░██╗██╗░░██╗░█████╗░░██████╗██╗███╗░░██╗██╗  ░█████╗░██╗
██╔════╝██║░░░██║██║░░██║██╔══██╗██╔════╝██║████╗░██║██║  ██╔══██╗██║
╚█████╗░██║░░░██║███████║███████║╚█████╗░██║██╔██╗██║██║  ███████║██║
░╚═══██╗██║░░░██║██╔══██║██╔══██║░╚═══██╗██║██║╚████║██║  ██╔══██║██║
██████╔╝╚██████╔╝██║░░██║██║░░██║██████╔╝██║██║░╚███║██║  ██║░░██║██║
╚═════╝░░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░╚═╝╚═╝░░╚══╝╚═╝  ╚═╝░░╚═╝╚═╝                                       
    `).start();
 
  rainbow.stop();

  console.log(
    gradient.pastel(`
   🌸 Welcome to Suhasini AI, your friendly mood companion! 🌸
   Let Suhasini guide you through an uplifting conversation.
   Whether you're feeling good, sad, or neutral, 
   Suhasini-AI is here to listen and respond. Enjoy the chat!
  `)
  );
  
  console.log(chalk.gray("Press Ctrl + C To Exit At Any Time\n"));

  const gemini = new Gemini(API_KEY);
  const chat = gemini.createChat();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Handle the mood check
  handleMoodCheck(rl, chat);
};

main();
