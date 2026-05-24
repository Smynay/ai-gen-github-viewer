import useSWR from 'swr'
import {
  fetchUserRepos,
  fetchCommitCount,
  fetchRepoLanguages,
  type RepoWithDetails,
} from '../services/github'

async function getReposWithDetails(username: string): Promise<RepoWithDetails[]> {
  const repos = await fetchUserRepos(username)

  const enrichedRepos = await Promise.all(
    repos.map(async (repo) => {
      const [commitCount, languages] = await Promise.all([
        fetchCommitCount(repo.owner.login, repo.name),
        fetchRepoLanguages(repo.languages_url),
      ])

      const sortedLanguages = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .map(([lang]) => lang)

      const topLanguages = sortedLanguages.slice(0, 3)
      const hasMoreLanguages = sortedLanguages.length > 3

      return {
        ...repo,
        commitCount,
        languages: sortedLanguages,
        topLanguages: hasMoreLanguages ? [...topLanguages, '...'] : topLanguages,
      }
    })
  )

  return enrichedRepos
}

export function useRepos(username: string | null) {
  const { data, error, isLoading } = useSWR(
    username ? `repos-${username}` : null,
    () => getReposWithDetails(username!),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return {
    repos: data,
    error,
    isLoading,
  }
}
