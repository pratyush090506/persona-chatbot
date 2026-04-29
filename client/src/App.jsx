import { useState, useRef, useEffect } from 'react'
import PersonaSwitcher from './components/PersonaSwitcher'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import { personas } from './data/personas'

const API_URL = import.meta.env.VITE_API_URL || ''

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(t)
      reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }))
    }, { once: true })
  })

export default function App() {
  const [activePersona, setActivePersona] = useState('anshuman')
  const [conversations, setConversations] = useState({
    anshuman: [],
    abhimanyu: [],
    kshitij: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [streamingPersonaId, setStreamingPersonaId] = useState(null)
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  )

  const abortRef = useRef(null)

  // Apply dark class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const persona = personas[activePersona]
  const messages = conversations[activePersona]

  const handleSend = async (text) => {
    if (!text.trim() || isLoading || streamingPersonaId) return

    const currentPersona = activePersona
    const userMessage = { role: 'user', content: text.trim() }
    const updatedMessages = [...conversations[currentPersona], userMessage]

    setConversations((prev) => ({ ...prev, [currentPersona]: updatedMessages }))
    setIsLoading(true)

    abortRef.current = new AbortController()

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId: currentPersona, messages: updatedMessages }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong.')
      }

      setConversations((prev) => ({
        ...prev,
        [currentPersona]: [...updatedMessages, { role: 'assistant', content: '' }],
      }))
      setIsLoading(false)
      setStreamingPersonaId(currentPersona)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') continue

          try {
            const parsed = JSON.parse(raw)

            if (parsed.error) {
              setConversations((prev) => {
                const msgs = [...prev[currentPersona]]
                msgs[msgs.length - 1] = {
                  role: 'assistant',
                  content: `⚠️ ${parsed.error}`,
                  isError: true,
                }
                return { ...prev, [currentPersona]: msgs }
              })
              return
            }

            if (parsed.text) {
              setConversations((prev) => {
                const msgs = [...prev[currentPersona]]
                const last = { ...msgs[msgs.length - 1] }
                last.content += parsed.text
                msgs[msgs.length - 1] = last
                return { ...prev, [currentPersona]: msgs }
              })
              await sleep(28, abortRef.current?.signal)
            }
          } catch {
            // skip malformed SSE line
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return

      setConversations((prev) => {
        const base = prev[currentPersona]
        const last = base[base.length - 1]
        const msgs =
          last?.role === 'assistant' && last.content === ''
            ? base.slice(0, -1)
            : base
        return {
          ...prev,
          [currentPersona]: [
            ...msgs,
            {
              role: 'assistant',
              content: `⚠️ ${err.message || 'Could not reach the server. Please try again.'}`,
              isError: true,
            },
          ],
        }
      })
      setIsLoading(false)
    } finally {
      setStreamingPersonaId(null)
      abortRef.current = null
    }
  }

  const handleSwitchPersona = (personaId) => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setIsLoading(false)
    setStreamingPersonaId(null)
    setActivePersona(personaId)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 transition-colors duration-200">
      <PersonaSwitcher
        activePersona={activePersona}
        onSwitch={handleSwitchPersona}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <ChatWindow
        messages={messages}
        persona={persona}
        isLoading={isLoading}
        isStreaming={streamingPersonaId === activePersona}
        onChipClick={handleSend}
      />
      <InputBar
        onSend={handleSend}
        isLoading={isLoading || streamingPersonaId === activePersona}
        persona={persona}
      />
    </div>
  )
}
