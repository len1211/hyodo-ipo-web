// types/ipo.ts
export type FirebaseIPO = {
    stockName: string;
    schedule: string;
    price: string;
    minDeposit: string;
    competitionRate: string;
    recommendState: string;
    underwriter: string;
    reason?: string;
    category?: string;
    lockupRate?: string;
    retailCompetition?: string;
    listingDate?: string;
  };
  
  export interface Subscription {
    id: string;
    name: string;
    category: string;
    status: 'recommended' | 'caution' | 'not-recommended';
    statusText: string;
    startDate: string;
    endDate: string;
    competitionRatio: string;
    price: string;
    description: string;
    badge?: string;
  }