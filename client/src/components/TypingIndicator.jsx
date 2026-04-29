export default function TypingIndicator({ persona }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center
        text-white text-[10px] font-bold mt-0.5 ${persona.colors.avatar}`}>
        {persona.avatar}
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
        shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5
        transition-colors duration-200">
        <span className={`typing-dot w-2 h-2 rounded-full ${persona.colors.dot}`} />
        <span className={`typing-dot w-2 h-2 rounded-full ${persona.colors.dot}`} />
        <span className={`typing-dot w-2 h-2 rounded-full ${persona.colors.dot}`} />
      </div>
    </div>
  )
}
