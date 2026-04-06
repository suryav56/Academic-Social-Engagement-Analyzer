export function computeEngagementScore({ leetcode = {}, codechef = {}, hackerrank = {} }) {
  const lcScore = Math.min(100,
    ((leetcode.easy_solved || 0) * 1) +
    ((leetcode.medium_solved || 0) * 2) +
    ((leetcode.hard_solved || 0) * 4) +
    ((leetcode.contests_participated || 0) * 3)
  )
  const ccScore = Math.min(100,
    ((codechef.total_solved || 0) * 1.5) +
    ((codechef.contests_participated || 0) * 2)
  )
  const hrScore = Math.min(100,
    ((hackerrank.badges_count || 0) * 5) +
    ((hackerrank.certificates || 0) * 10)
  )
  const total = Math.round((lcScore * 0.5) + (ccScore * 0.3) + (hrScore * 0.2))
  return Math.min(100, total)
}

export function getScoreColor(score) {
  if (score >= 70) return '#16A34A'
  if (score >= 40) return '#D97706'
  return '#DC2626'
}

export function getScoreLabel(score) {
  if (score >= 70) return 'Excellent'
  if (score >= 40) return 'Moderate'
  return 'At Risk'
}
