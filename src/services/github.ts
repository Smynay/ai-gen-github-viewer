import { getMockCommitCount, getMockLanguages, getMockRepos } from './mocks'
import { USE_MOCKS } from './env'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  owner: {
    login: string
  }
  stargazers_count: number
  forks_count: number
  language: string | null
  pushed_at: string | null
  created_at: string
  updated_at: string
  html_url: string
  languages_url: string
}

export interface RepoWithDetails extends GitHubRepo {
  commitCount: number
  languages: string[]
  topLanguages: string[]
}

const API_BASE = 'https://api.github.com'

async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found')
    }
    if (response.status === 403) {
      throw new Error('API rate limit exceeded. Please try again later.')
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockRepos()
  }

  return githubFetch<GitHubRepo[]>(`/users/${encodeURIComponent(username)}/repos?per_page=30&sort=pushed`)
}

export async function fetchCommitCount(owner: string, repo: string): Promise<number> {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getMockCommitCount()
  }

  const url = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=1`
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    return 0
  }

  const linkHeader = response.headers.get('link')
  if (linkHeader) {
    const match = linkHeader.match(/page=(\d+)[^>]*>;\s*rel="last"/)
    if (match) {
      return parseInt(match[1], 10)
    }
  }

  const data = (await response.json()) as unknown[]
  return data.length
}

export async function fetchRepoLanguages(languagesUrl: string): Promise<Record<string, number>> {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return getMockLanguages()
  }

  const response = await fetch(languagesUrl, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    return {}
  }

  return response.json() as Promise<Record<string, number>>
}
