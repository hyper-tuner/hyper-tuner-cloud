import React from 'react';

type KeyEvent = KeyboardEvent | React.KeyboardEvent<HTMLInputElement>;

enum Keys {
  INCREMENT = '.',
  DECREMENT = ',',
  COMMAND = 'p',
  SIDEBAR = '\\',
  ESCAPE = 'Escape',
  REPLACE = '=',
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
}

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const isCommand = (e: KeyEvent) => (e.metaKey || e.ctrlKey) && e.key === Keys.COMMAND;
export const isToggleSidebar = (e: KeyEvent) => (e.metaKey || e.ctrlKey) && e.key === Keys.SIDEBAR;
export const isIncrement = (e: KeyEvent) => e.key === Keys.INCREMENT;
export const isDecrement = (e: KeyEvent) => e.key === Keys.DECREMENT;
export const isReplace = (e: KeyEvent) => e.key === Keys.REPLACE;
export const isEscape = (e: KeyEvent) => e.key === Keys.ESCAPE;
export const isUp = (e: KeyEvent) => e.key === Keys.UP;
export const isDown = (e: KeyEvent) => e.key === Keys.DOWN;
export const isLeft = (e: KeyEvent) => e.key === Keys.LEFT;
export const isRight = (e: KeyEvent) => e.key === Keys.RIGHT;
export const useDigits = (e: KeyEvent): [boolean, number] => [digits.includes(Number(e.key)), Number(e.key)];
