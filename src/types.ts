export interface User extends Coordinates {
  color: string;
  hue: string;
  isTyping?: boolean;
  message?: string;
}

export interface Coordinates {
  x: number | undefined;
  y: number | undefined;
}

export interface Payload<T> {
  type: string;
  event: string;
  payload?: T;
}
