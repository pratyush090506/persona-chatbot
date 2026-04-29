import { useState, useRef } from 'react'

export default function InputBar({ onSend, isLoading, persona }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setText('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800
      px-4 py-4 shrink-0 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-end gap-2
          bg-gray-50 dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-2xl px-4 py-2.5
          focus-within:border-gray-300 dark:focus-within:border-gray-600
          focus-within:bg-white dark:focus-within:bg-gray-800
          transition-colors duration-150">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={`Message ${persona.name.split(' ')[0]}…`}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              outline-none disabled:opacity-50
              max-h-36 overflow-y-auto leading-relaxed py-0.5"
            style={{ scrollbarWidth: 'thin' }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
              text-white transition-all duration-150 mb-0.5
              disabled:opacity-30 disabled:cursor-not-allowed
              ${persona.colors.sendBtn}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[11px] text-gray-300 dark:text-gray-700 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </footer>
  )
}
