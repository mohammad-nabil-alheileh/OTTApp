// What went wrong when a screen or rail asked for content: the device has no
// usable connection, or the request reached the service and it failed.
export type LoadFailureKind = 'offline' | 'error';

export interface LoadFailure {
  kind: LoadFailureKind;
}
