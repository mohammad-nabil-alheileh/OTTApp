export interface KeyboardFocusPos {
  /** -1 = close button, 0..3 = character rows, 4 = action row */
  row: number;
  /** 0..9 for rows 0..3, 0..2 for row 4 (0=DEL, 1=SPACE, 2=CLEAR), 0 for row -1 */
  col: number;
}

export const INITIAL_FOCUS_POS: KeyboardFocusPos = { row: 0, col: 0 };

/**
 * Pure function to calculate next focus position with strict horizontal trapping.
 * - At left edge (col 0): Left goes nowhere (trapped).
 * - At right edge: Right goes nowhere (trapped).
 * - Row 4 (action row): 0=DEL, 1=SPACE, 2=CLEAR. DEL -> SPACE -> CLEAR.
 */
export const moveFocus = (
  current: KeyboardFocusPos,
  direction: 'left' | 'right' | 'up' | 'down',
): KeyboardFocusPos => {
  const { row, col } = current;

  if (direction === 'left') {
    if (row === -1) {
      // Close button: trapped horizontally
      return current;
    }
    if (row >= 0 && row <= 3) {
      // Character rows (0..9): trapped at left limit (0)
      if (col > 0) {
        return { row, col: col - 1 };
      }
      return current; // trapped!
    }
    if (row === 4) {
      // Action row (0=DEL, 1=SPACE, 2=CLEAR): trapped at DEL (0)
      if (col > 0) {
        return { row, col: col - 1 };
      }
      return current; // trapped!
    }
  }

  if (direction === 'right') {
    if (row === -1) {
      // Close button: trapped horizontally
      return current;
    }
    if (row >= 0 && row <= 3) {
      // Character rows (0..9): trapped at right limit (9)
      if (col < 9) {
        return { row, col: col + 1 };
      }
      return current; // trapped!
    }
    if (row === 4) {
      // Action row (0=DEL, 1=SPACE, 2=CLEAR): trapped at CLEAR (2)
      if (col < 2) {
        return { row, col: col + 1 };
      }
      return current; // trapped!
    }
  }

  if (direction === 'up') {
    if (row === -1) {
      // Trapped at top limit
      return current;
    }
    if (row === 0) {
      // From number row: go up to Close button
      return { row: -1, col: 0 };
    }
    if (row >= 1 && row <= 3) {
      return { row: row - 1, col };
    }
    if (row === 4) {
      // From action row up to row 3:
      // col 0 (DEL) -> col 1 ('V')
      // col 1 (SPACE) -> col 4 ('Y')
      // col 2 (CLEAR) -> col 8 ('.')
      const targetCol = col === 0 ? 1 : col === 1 ? 4 : 8;
      return { row: 3, col: targetCol };
    }
  }

  if (direction === 'down') {
    if (row === -1) {
      // From close button go down to right side of number row
      return { row: 0, col: 9 };
    }
    if (row >= 0 && row <= 2) {
      return { row: row + 1, col };
    }
    if (row === 3) {
      // From row 3 (col 0..9) down to action row (col 0..2):
      // col 0..2 (U, V, W) -> DEL (0)
      // col 3..6 (X, Y, Z, -) -> SPACE (1)
      // col 7..9 (', ., ,) -> CLEAR (2)
      const targetCol = col <= 2 ? 0 : col <= 6 ? 1 : 2;
      return { row: 4, col: targetCol };
    }
    if (row === 4) {
      // Trapped at bottom limit
      return current;
    }
  }

  return current;
};
