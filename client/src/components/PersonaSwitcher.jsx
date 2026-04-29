import { personas } from '../data/personas'

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export default function PersonaSwitcher({ activePersona, onSwitch, theme, onToggleTheme }) {
  const active = personas[activePersona]

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0 transition-colors duration-200">
      {/* Tab row + theme toggle */}
      <div className="max-w-2xl mx-auto px-4 pt-3 pb-0 flex items-center justify-between">
        <div className="flex gap-1">
          {Object.values(personas).map((persona) => {
            const isActive = activePersona === persona.id
            return (
              <button
                key={persona.id}
                onClick={() => onSwitch(persona.id)}
                className={`
                  px-3.5 py-2 text-sm font-medium rounded-t-lg transition-all duration-150 border-b-2
                  ${isActive
                    ? `${persona.colors.tab} ${persona.colors.tabBorder}`
                    : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
                  }
                `}
              >
                {persona.name.split(' ')[0]}
              </button>
            )
          })}
        </div>

        {/* Dark / light toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-gray-400 dark:text-gray-500
            hover:text-gray-600 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors duration-150"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {/* Active persona info strip */}
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-2.5">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${active.colors.avatar}`}>
          {active.avatar}
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active.name}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{active.title}</span>
        </div>
      </div>
    </header>
  )
}
