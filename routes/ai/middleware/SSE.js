const { createParser } = require('eventsource-parser');
const axios = require('axios');

async function fetchSSE(resource, options) {
    const { onMessage, onData, ...fetchOptions } = options;
    const response = await axios({
        url: resource,
        responseType: 'stream',
        ...fetchOptions,
    })
    response.data.on('data', e => parser.feed(e.toString()));
    const parser = createParser((event) => {
        if (event.type === 'event') {
            onMessage(event);
        }
    })
}

module.exports = { fetchSSE };
