import { useState, type FormEvent } from 'react'

interface SearchBarProps {
  initialValue?: string
  onSearch: (username: string) => void
}

export default function SearchBar({ initialValue = '', onSearch }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-[#6e7781] dark:text-[#8b949e] pointer-events-none flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11 6.5a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11 6.5Z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Enter GitHub username..."
          className="
            w-full h-8 pl-9 pr-3
            bg-[#f6f8fa] dark:bg-[#0d1117]
            border border-[#d0d7de] dark:border-[#30363d]
            rounded-md
            text-sm text-[#1f2328] dark:text-[#c9d1d9]
            placeholder-[#6e7781] dark:placeholder-[#8b949e]
            shadow-[inset_0_1px_0_rgba(208,215,222,0.2)] dark:shadow-[inset_0_1px_0_rgba(48,54,61,0.2)]
            outline-none
            focus:border-[#0969da] dark:focus:border-[#58a6ff]
            focus:ring-[3px] focus:ring-[#0969da]/30 dark:focus:ring-[#58a6ff]/30
            transition-all
          "
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="
            ml-2
            h-8 px-3
            bg-[#2da44e] hover:bg-[#2c974b] active:bg-[#298e46]
            dark:bg-[#238636] dark:hover:bg-[#2ea043] dark:active:bg-[#3fb950]
            text-white text-sm font-medium
            rounded-md
            border border-[rgba(31,35,40,0.15)] dark:border-[rgba(240,246,252,0.1)]
            shadow-[0_1px_0_rgba(31,35,40,0.1)] dark:shadow-none
            active:shadow-[inset_0_1px_0_rgba(31,35,40,0.2)] dark:active:shadow-[inset_0_1px_0_rgba(0,0,0,0.2)]
            transition-colors
          "
        >
          Search
        </button>
      </div>
    </form>
  )
}
