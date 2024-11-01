import { createParser } from "eventsource-parser"
import { isEmpty } from "lodash-es"
import { streamAsyncIterable } from "./stream-async-iterable.js"

export async function fetchSSE(resource, options) {
    const { onMessage, ...fetchOptions } = options
    // const eventSource = new EventSource(resource + "?" + new URLSearchParams(options.query), { withCredentials: true });
    // eventSource.onmessage = function (event) {
    //     alert(event.data);
    // };
    const resp = await fetch(resource + "?" + new URLSearchParams(options.query), fetchOptions)
    if (!resp.ok) {
        const error = await resp.json().catch((err) => ({}))
        throw new Error(
            !isEmpty(error)
                ? JSON.stringify(error)
                : `${resp.status} ${resp.statusText}`
        )
    }
    const clone = resp.clone()
    const parser = createParser(event => {
        if (event.type === "event") {
            onMessage(event.data)
        }
    })
    for await (const chunk of streamAsyncIterable(resp.body)) {
        const str = new TextDecoder().decode(chunk)
        parser.feed(str)
    }
    try {
        return await clone.json()
    } catch (error) {
        return null
    }
}

// export async function fetchSSE(resource, options) {
//     const { onMessage, query = {} } = options;
//     let url = new URL(resource);
//     url.searchParams.set('data', JSON.stringify(query));
//     const eventSource = new EventSource(url, { withCredentials: true });
//     eventSource.onmessage = (event) => {
//         console.log(event);
//         if (event.data === "[DONE]")
//             eventSource.close()

//         onMessage(event)
//     };
// }