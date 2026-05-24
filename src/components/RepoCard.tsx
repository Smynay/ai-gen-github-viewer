import type { RepoWithDetails } from '../services/github'

interface RepoCardProps {
  repo: RepoWithDetails
}

export default function RepoCard({ repo }: RepoCardProps) {
  const truncateDescription = (desc: string | null, maxLength = 200) => {
    if (!desc) return 'No description'
    if (desc.length <= maxLength) return desc
    return desc.slice(0, maxLength) + '...'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toISOString().split('T')[0]
  }

  return (
    <div className="card bg-base-200 shadow-md border border-base-300 hover:shadow-lg transition-shadow">
      <div className="card-body">
        <h2 className="card-title text-lg">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary hover:underline"
          >
            {repo.name}
          </a>
        </h2>

        <p className="text-base-content/70 text-sm">
          {truncateDescription(repo.description)}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {repo.topLanguages.map((lang, index) => (
            <span
              key={`${lang}-${index}`}
              className={`badge badge-sm border ${lang === '...' ? 'badge-ghost border-transparent' : 'bg-[#ddf4ff] text-[#0969da] border-[#0969da]/20 dark:bg-[#388bfd1a] dark:text-[#58a6ff] dark:border-[#58a6ff]/30'}`}
            >
              {lang}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-base-content/60">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>{repo.commitCount.toLocaleString()} commits</span>
          </div>

          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Updated {formatDate(repo.pushed_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
