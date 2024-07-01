const promptfoo = require('../../dist/src/index.js').default;

class CustomApiProvider {
  constructor(options) {
    // The caller may override Provider ID (e.g. when using multiple instances of the same provider)
    this.providerId = options.id || 'custom provider';

    // The config object contains any options passed to the provider in the config file.
    this.config = options.config;
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt) {
    const body = {
      model: 'llama3',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: parseInt(this.config?.max_tokens, 10) || 1024,
      temperature: parseFloat(this.config?.temperature) || 0,
    };

    // Fetch the data from the API using promptfoo's cache. You can use your own fetch implementation if preferred.
    const { data, cached } = await promptfoo.cache.fetchWithCache(
      'http://localhost:11434/api/generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
      },
      40_000 /* 10 second timeout */,
    );

    const ret = {
      output: data.response,
      tokenUsage: {
        total: data.usage.total_tokens,
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
      },
    };
    return ret;
  }
}

module.exports = CustomApiProvider;