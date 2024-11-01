import config from "../../config"
import { fetchSSE } from "./fetch-sse"

const BASE_URL = config.baseURL
// const BASE_URL = "https://jowry.click/api"


export class ChatGPProvider {
    constructor(token, { plugin, model, chatId,plugins }) {
        this.token = token
        this.config = {
            plugin, model, chatId,plugins
        }
    }

    async generateAnswer(params) {

        let conversationId

        const cleanup = () => {
            if (conversationId) {
                // cleanup
            }
        }
        let Generatedmessage = ""

        const data = await fetchSSE(`${BASE_URL}ai/v2/conversation`, {
            method: "GET",
            signal: params.signal,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`
            },
            query: {
                data: JSON.stringify({
                    message: params.prompt,
                    id: this.config.chatId || null,
                    model: this.config.model || "gpt-3.5-turbo",
                    plugin: this.config.plugin,
                    plugins: this.config.plugins,
                    realtime: params.realtime,
                    autoThink: params.autoThink
                })
            },
            onMessage(message) {
                console.debug("sse message", message)
                if (message === "[DONE]") {
                    params.onEvent({ type: "done" })
                    return
                }
                let data
                try {
                    data = JSON.parse(message)
                } catch (err) {
                    console.error(err)
                    return
                }

                if (data.type === "reference") {
                    return params.onEvent({
                        type: data.type,
                        data: {
                            references: data.references
                        }
                    })
                }
                if (data.type === "action") {
                    return params.onEvent({
                        type: data.type,
                        data: {
                            message: data.message
                        }
                    })
                }

                if (data.error) {
                    return params.onEvent({
                        type: "error",
                        data: data.error
                    })
                }
                if (data.images) {
                    conversationId = data.conversation_id
                    return params.onEvent({
                        type: "images",
                        data: {
                            images: data.images,
                            messageId: data.id,
                            conversationId: conversationId
                        }
                    })
                } else {

                    Generatedmessage += data.choices[0]?.delta?.content || ""

                    if (Generatedmessage) {
                        conversationId = data.conversation_id
                        params.onEvent({
                            type: "answer",
                            data: {
                                answer: Generatedmessage,
                                messageId: data.id,
                                conversationId: data.conversation_id
                            }
                        })
                    }
                }
            }
        })
        return { cleanup, data }
    }
}
