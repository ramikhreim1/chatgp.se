const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_1,
});

const openai = new OpenAIApi(configuration);

const LEGACY_MODEL_MAP = {
  davinci: 'gpt-4o-mini',
  curie: 'gpt-4o-mini',
  'gpt-3.5-turbo-0613': 'gpt-4o-mini',
  'gpt-3.5-turbo-instruct': 'gpt-4o-mini',
  'text-davinci-003': 'gpt-4o-mini',
};

const normalizeModel = (modelOrEngine) => {
  if (!modelOrEngine) return 'gpt-4o-mini';
  return LEGACY_MODEL_MAP[modelOrEngine] || modelOrEngine;
};

openai.complete = async ({
  engine,
  model,
  prompt,
  maxTokens,
  temperature,
  topP,
  frequencyPenalty,
  presencePenalty,
  stop,
  n,
  stream,
  user,
}) => {
  const chatModel = normalizeModel(model || engine);

  const response = await openai.createChatCompletion({
    model: chatModel,
    messages: [
      {
        role: 'user',
        content: String(prompt || ''),
      },
    ],
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stop,
    n,
    stream,
    user,
  });

  const choices = (response?.data?.choices || []).map((choice) => {
    const content = choice?.message?.content || '';
    return {
      ...choice,
      text: content,
      message: { role: 'assistant', content },
    };
  });

  return {
    ...response,
    data: {
      ...response.data,
      choices,
    },
  };
};

openai.chatComplete = async ({ model = 'gpt-4o-mini', messages, temperature = 0.2, user }) => {
  return openai.createChatCompletion({
    model: normalizeModel(model),
    messages,
    temperature,
    user,
  });
};

module.exports = openai;
