import { useState } from "react"

export function useWorker(messageEventHandler) {
  // Create new worker once and never again
  const [worker] = useState(() => createWorker(messageEventHandler))
  return worker
}

function createWorker(messageEventHandler) {

  const worker = new Worker('../worker.js', { type: "module" })

  // Listen for messages from the Web Worker
  worker.addEventListener("message", messageEventHandler)
  return worker
}
