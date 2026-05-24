import { render, screen } from '@testing-library/react'
import RepoCard from './RepoCard'
import type { RepoWithDetails } from '../services/github'

const mockRepo: RepoWithDetails = {
  id: 1,
  name: 'test-repo',
  full_name: 'user/test-repo',
  description: 'This is a test repository with a description that might be long but we will test truncation separately',
  owner: { login: 'user' },
  stargazers_count: 42,
  forks_count: 7,
  language: 'TypeScript',
  pushed_at: '2024-03-15T10:30:00Z',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2024-03-15T10:30:00Z',
  html_url: 'https://github.com/user/test-repo',
  languages_url: 'https://api.github.com/repos/user/test-repo/languages',
  commitCount: 123,
  languages: ['TypeScript', 'JavaScript', 'CSS'],
  topLanguages: ['TypeScript', 'JavaScript', 'CSS'],
}

describe('RepoCard', () => {
  it('renders repo name as link', () => {
    render(<RepoCard repo={mockRepo} />)
    const link = screen.getByRole('link', { name: /test-repo/i })
    expect(link).toHaveAttribute('href', 'https://github.com/user/test-repo')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders description', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText(/This is a test repository/i)).toBeInTheDocument()
  })

  it('truncates long descriptions to 200 chars', () => {
    const longDesc = 'a'.repeat(250)
    const repo = { ...mockRepo, description: longDesc }
    render(<RepoCard repo={repo} />)
    const text = screen.getByText(/a\.\.\./)
    expect(text.textContent).toHaveLength(203) // 200 + '...'
  })

  it('shows "No description" when description is null', () => {
    const repo = { ...mockRepo, description: null }
    render(<RepoCard repo={repo} />)
    expect(screen.getByText(/No description/i)).toBeInTheDocument()
  })

  it('renders top languages', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
  })

  it('renders "..." when there are more than 3 languages', () => {
    const repo = {
      ...mockRepo,
      topLanguages: ['TypeScript', 'JavaScript', 'CSS', '...'],
    }
    render(<RepoCard repo={repo} />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('renders star count', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders fork count', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('renders commit count', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText(/123 commits/i)).toBeInTheDocument()
  })

  it('renders last commit date in YYYY-MM-DD format', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText(/2024-03-15/)).toBeInTheDocument()
  })
})
