import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { useRepos } from './useRepos'
import * as githubService from '../services/github'

jest.mock('../services/github')

const mockedGithubService = githubService as jest.Mocked<typeof githubService>

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  )
}

describe('useRepos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns repos when username is provided', async () => {
    const mockRepo = {
      id: 1,
      name: 'repo-1',
      full_name: 'user/repo-1',
      description: 'Test repo',
      owner: { login: 'user' },
      stargazers_count: 10,
      forks_count: 2,
      language: 'TypeScript',
      pushed_at: '2024-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      html_url: 'https://github.com/user/repo-1',
      languages_url: 'https://api.github.com/repos/user/repo-1/languages',
    }

    mockedGithubService.fetchUserRepos.mockResolvedValue([mockRepo])
    mockedGithubService.fetchCommitCount.mockResolvedValue(50)
    mockedGithubService.fetchRepoLanguages.mockResolvedValue({ TypeScript: 1000, JavaScript: 500 })

    const { result } = renderHook(() => useRepos('testuser'), { wrapper })

    await waitFor(() => {
      expect(result.current.repos).toBeDefined()
    })

    expect(result.current.repos).toHaveLength(1)
    expect(result.current.repos![0].name).toBe('repo-1')
    expect(result.current.repos![0].commitCount).toBe(50)
    expect(result.current.repos![0].topLanguages).toEqual(['TypeScript', 'JavaScript'])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('returns null repos when username is null', () => {
    const { result } = renderHook(() => useRepos(null), { wrapper })
    expect(result.current.repos).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('returns error when fetch fails', async () => {
    mockedGithubService.fetchUserRepos.mockRejectedValue(new Error('User not found'))

    const { result } = renderHook(() => useRepos('nonexistent'), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })

    expect(result.current.error?.message).toBe('User not found')
    expect(result.current.isLoading).toBe(false)
  })
})
