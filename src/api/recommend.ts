import type { WizardData, RecommendationResponse } from '../types';

export async function recommend(data: WizardData): Promise<RecommendationResponse> {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.status === 429) {
    throw new Error('rate_limit');
  }
  if (!res.ok) {
    throw new Error('generic');
  }

  return res.json() as Promise<RecommendationResponse>;
}
