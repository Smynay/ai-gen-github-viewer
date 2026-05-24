/// <reference types="cypress" />

describe('GitHub Repository Viewer', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the search page', () => {
    cy.contains('GitHub Repository Viewer')
    cy.get('input[placeholder="Enter GitHub username..."]').should('be.visible')
    cy.contains('button', 'Search').should('be.visible')
  })

  it('shows empty state initially', () => {
    cy.contains('Enter a GitHub username to view their repositories')
  })

  it('searches for a user and displays repos', () => {
    cy.intercept('GET', 'https://api.github.com/users/*/repos?*', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'test-repo',
          full_name: 'octocat/test-repo',
          description: 'A test repository',
          owner: { login: 'octocat' },
          stargazers_count: 100,
          forks_count: 10,
          language: 'TypeScript',
          pushed_at: '2024-01-01T00:00:00Z',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          html_url: 'https://github.com/octocat/test-repo',
          languages_url: 'https://api.github.com/repos/octocat/test-repo/languages',
        },
      ],
    }).as('getRepos')

    cy.intercept('GET', 'https://api.github.com/repos/*/test-repo/commits?per_page=1', {
      statusCode: 200,
      body: [{}],
      headers: {
        link: '<https://api.github.com/repositories/1/commits?per_page=1&page=42>; rel="last"',
      },
    }).as('getCommits')

    cy.intercept('GET', 'https://api.github.com/repos/octocat/test-repo/languages', {
      statusCode: 200,
      body: { TypeScript: 1000, JavaScript: 500 },
    }).as('getLanguages')

    cy.get('input[placeholder="Enter GitHub username..."]').type('octocat')
    cy.contains('button', 'Search').click()

    cy.wait('@getRepos')
    cy.wait('@getCommits')
    cy.wait('@getLanguages')

    cy.contains('test-repo')
    cy.contains('A test repository')
    cy.contains('42')
    cy.contains('100')
    cy.contains('10')
  })

  it('shows error for non-existent user', () => {
    cy.intercept('GET', 'https://api.github.com/users/nonexistent/repos?*', {
      statusCode: 404,
      body: { message: 'Not Found' },
    }).as('getReposError')

    cy.get('input[placeholder="Enter GitHub username..."]').type('nonexistent')
    cy.contains('button', 'Search').click()

    cy.wait('@getReposError')
    cy.contains('User not found')
  })
})
