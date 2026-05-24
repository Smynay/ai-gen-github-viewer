import { useCallback, useEffect, useState } from 'react'
import { useRepos } from '../hooks/useRepos'
import SearchBar from '../components/SearchBar'
import RepoCard from '../components/RepoCard'
import ThemeToggle from '../components/ThemeToggle'

function useQueryParam(key: string) {
  const [value, setValue] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get(key) || ''
  })

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      setValue(params.get(key) || '')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [key])

  const updateValue = useCallback(
    (newValue: string) => {
      const url = new URL(window.location.href)
      if (newValue) {
        url.searchParams.set(key, newValue)
      } else {
        url.searchParams.delete(key)
      }
      window.history.pushState({}, '', url)
      setValue(newValue)
    },
    [key]
  )

  return [value, updateValue] as const
}

export default function HomePage() {
  const [username, setUsername] = useQueryParam('user')
  const { repos, error, isLoading } = useRepos(username || null)

  const handleSearch = (user: string) => {
    setUsername(user)
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="border-b border-base-300 bg-base-100/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-5xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-base-content">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <h1 className="text-xl font-bold">GitHub Repository Viewer</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Decorative divider */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50" />

      {/* Hero Section */}
      <section className="bg-base-200/50 py-12 mb-8">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-4xl font-bold mb-4">Explore GitHub Repositories</h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
            A simple and elegant tool to browse and explore public repositories from any GitHub user. 
            View stars, forks, languages, and commit history in a clean interface.
          </p>
          <SearchBar key={username} initialValue={username} onSearch={handleSearch} />
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-5xl pb-12">
        {isLoading && (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {error && (
          <div className="alert alert-error max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error instanceof Error ? error.message : 'An error occurred'}</span>
          </div>
        )}

        {!isLoading && !error && repos && repos.length === 0 && username && (
          <div className="text-center py-12 text-base-content/60">
            No repositories found for user "{username}"
          </div>
        )}

        {!isLoading && !error && repos && repos.length > 0 && (
          <div className="grid gap-4">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {!username && !isLoading && (
          <div className="text-center py-12 text-base-content/60">
            Enter a GitHub username to view their repositories
          </div>
        )}
      </main>
    </div>
  )
}
