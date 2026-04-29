import { useState } from 'react'

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// Renders inline \n as <br> within a paragraph
function InlineText({ text }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

// Parses the full assistant message into paragraphs and a takeaway block
function FormattedMessage({ content, persona, isStreaming }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean)
  const lastIdx = paragraphs.length - 1

  return (
    <div className="space-y-3">
      {paragraphs.map((para, i) => {
        const isTakeaway = /^📌/.test(para)
        const isLast = i === lastIdx

        if (isTakeaway) {
          const body = para.replace(/^📌\s*Key Takeaway:\s*/i, '').trim()
          return (
            <div
              key={i}
              className={`rounded-lg border-l-4 px-4 py-3 ${persona.colors.takeaway}`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${persona.colors.takeawayLabel}`}>
                📌 Key Takeaway
              </p>
              <p className="text-sm font-medium leading-relaxed">
                <InlineText text={body} />
                {isStreaming && isLast && (
                  <span className="streaming-cursor inline-block ml-0.5" />
                )}
              </p>
            </div>
          )
        }

        return (
          <p key={i} className="text-sm leading-relaxed">
            <InlineText text={para} />
            {isStreaming && isLast && (
              <span className="streaming-cursor inline-block ml-0.5" />
            )}
          </p>
        )
      })}

      {/* Cursor shown during streaming before any \n\n has appeared */}
      {isStreaming && paragraphs.length === 0 && (
        <span className="streaming-cursor inline-block ml-0.5" />
      )}
    </div>
  )
}

export default function MessageBubble({ message, persona, isStreaming }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isError = message.isError

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-br-sm
          bg-gray-900 text-white dark:bg-gray-700 dark:text-gray-100
          text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 group">
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center
        text-white text-[10px] font-bold mt-0.5 ${persona.colors.avatar}`}>
        {persona.avatar}
      </div>

      <div className="flex-1 min-w-0">
        {isError ? (
          <p className="text-sm text-red-500 dark:text-red-400 leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div className="text-gray-800 dark:text-gray-200">
            <FormattedMessage
              content={message.content}
              persona={persona}
              isStreaming={isStreaming}
            />
          </div>
        )}

        {!isStreaming && !isError && message.content && (
          <button
            onClick={handleCopy}
            className="mt-3 flex items-center gap-1.5 text-xs
              text-gray-400 hover:text-gray-600
              dark:text-gray-600 dark:hover:text-gray-400
              transition-colors opacity-0 group-hover:opacity-100"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
