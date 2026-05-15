import { useState } from 'react'

export function useLog(): [string, (msg: string) => void] {
  const [log, setLog] = useState('')
  const appendLog = (msg: string) => {
    setLog(prev => prev ? prev + '\n' + msg : msg)
  }
  return [log, appendLog]
}
