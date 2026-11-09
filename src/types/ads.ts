export interface Ad {
  id: string;
  title: string;
  // Shown next to "Sponsored" in the ad info box.
  advertiser?: string;
  url: string;
  // Seconds after which the viewer may skip; omit for a non-skippable ad.
  skipOffset?: number;
}

// A group of ads played back to back at one point of the content.
export interface AdBreak {
  id: string;
  // Content position, in seconds, at which the break starts.
  time: number;
  ads: Ad[];
}
