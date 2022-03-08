module.exports = {
  GITHUB_PERSONAL_ACCESS_TOKEN: require('./token'),
  baseURL: 'https://api.github.com/repos/',
  comments: '/comments?page=1&per_page=100',
  issues: '/issues/comments?page=1&per_page=100',
  pulls: '/pulls/comments?page=1&per_page=100',
  stats: '/stats/contributors',
}
