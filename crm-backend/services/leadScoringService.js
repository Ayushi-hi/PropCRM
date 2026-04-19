/**
 * Lead Scoring Logic
 * Score range: 0–100
 *
 * Scoring criteria:
 *   Budget provided          → +20
 *   Recent activity (7 days) → +30
 *   Multiple interactions    → +20
 *   Property visit done      → +30
 */

const calculateLeadScore = (lead) => {
  let score = 0;

  // +20: Budget is provided
  if (lead.budget && lead.budget > 0) {
    score += 20;
  }

  // +30: Was contacted in the last 7 days
  if (lead.lastContacted) {
    const daysSinceContact = (Date.now() - new Date(lead.lastContacted)) / (1000 * 60 * 60 * 24);
    if (daysSinceContact <= 7) {
      score += 30;
    } else if (daysSinceContact <= 14) {
      score += 15; // partial credit
    }
  }

  // +20: Has had multiple interactions (3 or more)
  if (lead.interactionCount >= 3) {
    score += 20;
  } else if (lead.interactionCount >= 1) {
    score += 10; // partial credit
  }

  // +30: Has visited at least one property
  if (lead.visitedProperties && lead.visitedProperties.length > 0) {
    score += 30;
  } else if (lead.interestedProperties && lead.interestedProperties.length > 0) {
    score += 10; // interested but not visited
  }

  return Math.min(score, 100);
};

/**
 * Next Best Action Logic
 * Returns a recommended action string based on lead state.
 */
const getNextBestAction = (lead) => {
  const daysSinceContact = lead.lastContacted
    ? (Date.now() - new Date(lead.lastContacted)) / (1000 * 60 * 60 * 24)
    : Infinity;

  // Not contacted yet
  if (!lead.lastContacted) {
    return 'Call Today';
  }

  // Contacted but no property visit
  if (lead.visitedProperties && lead.visitedProperties.length === 0) {
    if (lead.interestedProperties && lead.interestedProperties.length > 0) {
      return 'Schedule Visit';
    }
    return 'Send Property Options';
  }

  // Visited property — high score or qualified
  if (lead.visitedProperties && lead.visitedProperties.length > 0) {
    if (lead.score >= 80) {
      return 'Move to Negotiation';
    }
    if (lead.score >= 60) {
      return 'Schedule Follow-up';
    }
  }

  // Long gap since contact
  if (daysSinceContact > 14) {
    return 'Re-engage: Call Today';
  }

  // Status-based
  if (lead.status === 'Qualified') {
    return 'Move to Negotiation';
  }

  if (lead.status === 'Contacted') {
    return 'Send Property Options';
  }

  return 'Follow Up';
};

module.exports = { calculateLeadScore, getNextBestAction };