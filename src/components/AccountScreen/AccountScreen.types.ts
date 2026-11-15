import { AccountProfile } from '../../types/account';
import { VODItem } from '../../types/vod';

export interface AccountScreenProps {
  profile: AccountProfile;
  favorites: VODItem[];
  onSelectVOD: (vod: VODItem) => void;
  onBack: () => void;
}
