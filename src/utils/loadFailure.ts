import { LoadFailureKind } from '../types/load';

export interface FailureCopy {
  title: string;
  message: string;
}

// Shared wording so every screen and rail explains the same two situations
// the same way. `subject` reads as the thing that could not load, e.g.
// "videos", "search results", "podcasts".
export const failureCopy = (
  kind: LoadFailureKind,
  subject: string,
): FailureCopy =>
  kind === 'offline'
    ? {
        title: "You're offline",
        message: `Connect to the internet to load ${subject}.`,
      }
    : {
        title: `Couldn't load ${subject}`,
        message: 'Something went wrong on our end. Try again in a moment.',
      };
