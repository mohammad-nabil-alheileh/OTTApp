import { AccountProfile } from '../types/account';

// There is no account backend yet, so the profile is fixed sample data.
export const MOCK_ACCOUNT: AccountProfile = {
  name: 'Alex Carter',
  email: 'alex.carter@example.com',
  plan: 'Premium 4K',
  memberSince: 'March 2024',
  devices: '2 of 3 in use',
};

// "Alex Carter" → "AC", for the placeholder avatar and the header button.
export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
