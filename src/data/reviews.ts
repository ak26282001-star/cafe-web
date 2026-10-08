/**
 * ─────────────────────────────────────────────────────────────
 *  VERIFIED REVIEWS
 *
 *  Intentionally empty. Only add reviews that are real, quoted
 *  verbatim, and that you have permission to display (e.g. from
 *  the café's Google Business profile). When this list is empty
 *  the site shows just the rating summary and a link to Google.
 *
 *  Example shape:
 *  { quote: '…', author: 'First name L.', source: 'Google', date: '2026-05' }
 * ─────────────────────────────────────────────────────────────
 */
export interface VerifiedReview {
  quote: string
  author: string
  source: string
  date?: string
}

export const verifiedReviews: VerifiedReview[] = []
