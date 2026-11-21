/**
 * Smart Rule-Based Complaint Priority Engine
 * Computes priority transparently based on category, keywords, severity indicators, and public safety.
 * Structured cleanly without faking external AI models.
 */

function calculatePriority({ category, title = '', description = '', address = '' }) {
  const text = `${title} ${description} ${address}`.toLowerCase();
  let score = 0;
  const reasons = [];

  // 1. Category Base Weight
  switch (category) {
    case 'Illegal Dumping':
      score += 25;
      reasons.push('Illegal dumping poses health & sanitation risks');
      break;
    case 'Drainage':
      score += 20;
      reasons.push('Drainage blockage can lead to waterlogging and disease');
      break;
    case 'Water Leakage':
      score += 20;
      reasons.push('Water supply loss and potential road erosion');
      break;
    case 'Pothole/Road':
      score += 15;
      reasons.push('Road infrastructure impacts traffic and vehicle safety');
      break;
    case 'Garbage/Waste':
      score += 15;
      reasons.push('Municipal waste collection required');
      break;
    case 'Streetlight':
      score += 10;
      reasons.push('Lighting affects nighttime pedestrian & vehicle safety');
      break;
    case 'Public Toilet':
      score += 15;
      reasons.push('Sanitation facility upkeep');
      break;
    default:
      score += 10;
      reasons.push('Standard civic inquiry');
  }

  // 2. Critical Safety Keywords (+40 score)
  const criticalKeywords = [
    'live wire', 'sparking', 'electric shock', 'open manhole', 'manhole open',
    'gas leak', 'fire', 'collapsed', 'sinkhole', 'flood', 'flooding',
    'hazard', 'toxic', 'chemical spill', 'accident', 'deadly', 'emergency',
    'deep pothole', 'severe'
  ];

  for (const kw of criticalKeywords) {
    if (text.includes(kw)) {
      score += 40;
      reasons.push(`Critical safety alert triggered by keyword: "${kw}"`);
      break;
    }
  }

  // 3. High Impact / Vulnerable Area Keywords (+25 score)
  const highKeywords = [
    'school', 'hospital', 'clinic', 'playground', 'elderly',
    'overflowing', 'sewage', 'burst pipe', 'major road', 'highway',
    'traffic jam', 'foul smell', 'drinking water', 'contamination'
  ];

  for (const kw of highKeywords) {
    if (text.includes(kw)) {
      score += 20;
      reasons.push(`High impact area/factor identified: "${kw}"`);
      break;
    }
  }

  // 4. Map score to Priority Tier
  let priority = 'Medium';
  if (score >= 50) {
    priority = 'Critical';
  } else if (score >= 30) {
    priority = 'High';
  } else if (score >= 15) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  const priorityReason = reasons.join('; ') + ` (Calculated Score: ${score})`;

  return {
    priority,
    score,
    reasons,
    priorityReason
  };
}

module.exports = {
  calculatePriority
};
