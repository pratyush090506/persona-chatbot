import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import SuggestionChips from './SuggestionChips'

export default function ChatWindow({ messages, persona, isLoading, isStreaming, onChipClick }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const isEmpty = messages.length === 0 && !isLoading

  return (
    <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 min-h-0 transition-colors duration-200">
      {isEmpty ? (
        <SuggestionChips persona={persona} onChipClick={onChipClick} />
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
          {messages.map((message, i) => (
            <MessageBubble
              key={i}
              message={message}
              persona={persona}
              isStreaming={isStreaming && i === messages.length - 1 && message.role === 'assistant'}
            />
          ))}
          {isLoading && <TypingIndicator persona={persona} />}
          <div ref={bottomRef} />
        </div>
      )}
    </main>
  )
}
