export default function SuggestionChips({ persona, onChipClick }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 gap-8">
      <div className="text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4
          text-white text-lg font-bold shadow-sm ${persona.colors.avatar}`}>
          {persona.avatar}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          {persona.name}
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{persona.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-sm mx-auto leading-relaxed">
          Ask me anything about tech, careers, or my journey building Scaler.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {persona.chips.map((chip) => (
          <button
            key={chip}
            onClick={() => onChipClick(chip)}
            className={`text-sm px-4 py-3 rounded-xl text-left transition-all duration-150
              border leading-snug ${persona.colors.chip}`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}
