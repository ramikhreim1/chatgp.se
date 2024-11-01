const express = require('express');
const db = require("../models");
const Chat = db.chat;

const { Configuration, OpenAIApi } = require("openai");
const redisClient = require('../utils/redis');
const {getInformationFromUrl} = require('../utils/getInfoFromUrl');

// Create an array of OpenAI API keys to be used for load balancing
const apiKeys = [
  process.env.OPENAI_API_KEY_1,
  process.env.OPENAI_API_KEY_2,
  process.env.OPENAI_API_KEY_3
];

// Create multiple OpenAI API instances, each with a different API key
const openaiInstances = apiKeys.map(apiKey => {
  const configuration = new Configuration({ apiKey, organization: process.env.YOUR_ORG_ID, });
  return new OpenAIApi(configuration);
});

let app = express.Router();

// Keep track of the index of the next OpenAI API instance to use for load balancing
let currentIndex = 0;

app.post('/chat_gpt/:chatId', async (req, res, next) => {
  try {
    let { content, model, plugin = "", re } = req.body //for chat gpt prompt contains infomrmation about previous conversation with AI

    // Check if the user's input contains a URL
    const urls = req.body.content.match(/(https?:\/\/[^\s]+)/g);
    // If a URL is detected, extract relevant information using web scraping
    let inputRaw = content;

    // if (model === "gpt-4" && plugin === "internet_access") {
    //   model = 'gpt-3.5-turbo'
    // }

    // internet access plugin 
    if (urls && plugin === "internet_access") {
      for (const url of urls) {
        const websiteInfo = await getInformationFromUrl(url);
        if (!websiteInfo) throw new Error("failed to get information")
        // You can customize this message based on the extracted information
        const websiteSummary = `I found the following information about the website located at ${url}:
        Title: "${websiteInfo.title}"
        Meta Description: "${websiteInfo.meta}"
        H1 Tag: "${websiteInfo.h1}"
        H2 Tags: "${websiteInfo.h2}"
        Strong Tags: "${websiteInfo.strongTags}"
        
        Please create a completion tailored for individuals based on the provided website information.`;
        // Add the summary to the user's input before sending it to GPT-3
        content = content.replace(url, `${url} (${websiteSummary})`);
      }
    }

    let chat = null;
    let fromRedis = false
    let nmessages = []
    let pmessages = []

    //integrating with redis
    try {
      console.log(`${new Date().toLocaleTimeString()}: fetching ${req.user.email} chat chat_gpt_${req.params.chatId} from redis...`);
      chat = await redisClient.get(`chat_gpt_${req.params.chatId}`);
      if (!chat) {
        console.log(`${new Date().toLocaleTimeString()}: chat_gpt_${req.params.chatId} does not have any data on redis cache.`);
        console.log(`${new Date().toLocaleTimeString()}: fetching ${req.user.email} chat from database...`);
        chat = await Chat.findOne({
          user: req.user._id,
          _id: req.params.chatId
        });
        console.log(`${new Date().toLocaleTimeString()}: fetching ${req.user.email} chat from database completed`);
        pmessages = chat.messages
      } else {
        console.log(`${new Date().toLocaleTimeString()}: fetching ${req.user.email} chat chat_gpt_${req.params.chatId} from redis completed`);
        fromRedis = true;
        chat = JSON.parse(chat)
        pmessages = chat.messages
      }

    } catch (error) {
      console.log(`${new Date().toLocaleTimeString()}: chat_gpt_${req.params.chatId} does not have any data on redis cache. Error`, error);
      console.log(`${new Date().toLocaleTimeString()}: fetching ${req.user.email} chat from database...`);
      chat = await Chat.findOne({
        user: req.user._id,
        _id: req.params.chatId
      });
      pmessages = chat.messages
    }
    //integrating with redis end #########

    if (!chat) {
      return res.status(404).send({
        success: false,
        message: "chat not found"
      });
    }
    const msg = {
      sender: req.user._id,
      recipient: "GPT",
      text: content
    }
    pmessages.push(msg)
    if (!re) {
      nmessages.push({
        sender: req.user._id,
        recipient: "GPT",
        text: inputRaw
      })
    }


    console.log(`model: ${model}, plugin=${plugin}`)

    // Log the API key that will be used for this request
    const openaiInstance = openaiInstances[currentIndex];
    currentIndex = (currentIndex + 1) % openaiInstances.length; // update the index for the next request

    const numMessagesToInclude = 5; // Only include the last 5 messages in the chat history
    const startIndex = Math.max(0, pmessages.length - numMessagesToInclude); // Calculate the start index for the messages array
    const messages = pmessages.slice(startIndex).map(msg => ({ role: msg.sender === "GPT" ? "system" : "user", content: msg.text })); // Construct the messages array
    console.log(`${new Date().toLocaleTimeString()}: ${req.user.email} provided prompt: `, inputRaw)
    console.log(`${new Date().toLocaleTimeString()}: completion started, ${req.user.email} Using API key:`, apiKeys[currentIndex]);
    const completion = await openaiInstance.createChatCompletion({
      model: model || "gpt-3.5-turbo",
      messages,
      temperature: 0.2,
      user: req.user._id,
    });
    console.log(`${new Date().toLocaleTimeString()}: completion completed for: ${req.user.email}`);


    let output = `${completion.data.choices[0].message?.content}`;

    // If the output string ends with one or more hashtags, remove all of them
    if (output.endsWith('"')) {
      output = output.substring(0, output.length - 1);
    }

    // If the output string ends with one or more hashtags, remove all of them
    if (output.endsWith('"')) {
      output = output.substring(0, output.length - 1);
    }

    // remove a single new line at the end of output if there is one
    if (output.startsWith('\n')) {
      output = output.substring(1, output.length);
    }
    // remove a space from the start if any
    if (output.startsWith(' ')) {
      output = output.substring(1, output.length);
    }
    // remove a single new line at the end of output if there is one
    if (output.endsWith('\n')) {
      output = output.substring(0, output.length - 1);
    }

    if (output) {
      nmessages.push({
        sender: "GPT",
        recipient: req.user._id,
        text: output
      });
    }

    Chat.findOneAndUpdate({
      user: req.user._id,
      _id: req.params.chatId
    }, {
      $push: {
        messages: { $each: nmessages }
      }
    }, { new: true }).then((updated) => {
      try {
        console.info(`setting chat chat_gpt_${updated._id} to redis`);
        redisClient.set(`chat_gpt_${updated._id}`, JSON.stringify(updated.toJSON()));
      } catch (error) { console.error("error while setting chat : >>>", error) }
    }).catch(err => { console.error("error during updating chat"); return err; })
    req.locals.input = content;
    req.locals.inputRaw = inputRaw;
    req.locals.output = output;

    next();
  } catch (er) {
    console.error(`${new Date().toLocaleTimeString()}: Error during making chat completion and Error message is: `, er);
    res.status(500).json({
      success: false,
      message: er.message
    });
  }
});

module.exports = app;
