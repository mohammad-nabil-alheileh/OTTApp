import { moveFocus } from './keyboardNavigation.types';

describe('moveFocus in SearchKeyboard', () => {
  describe('Space bar navigation on action row', () => {
    it('moves from DEL to SPACE on right', () => {
      const next = moveFocus({ row: 4, col: 0 }, 'right');
      expect(next).toEqual({ row: 4, col: 1 });
    });

    it('moves from SPACE to CLEAR on right', () => {
      const next = moveFocus({ row: 4, col: 1 }, 'right');
      expect(next).toEqual({ row: 4, col: 2 });
    });

    it('moves from CLEAR to SPACE on left', () => {
      const next = moveFocus({ row: 4, col: 2 }, 'left');
      expect(next).toEqual({ row: 4, col: 1 });
    });

    it('moves from SPACE to DEL on left', () => {
      const next = moveFocus({ row: 4, col: 1 }, 'left');
      expect(next).toEqual({ row: 4, col: 0 });
    });
  });

  describe('Horizontal line trapping', () => {
    it('traps at left edge of character rows (going left goes nowhere)', () => {
      for (let row = 0; row <= 3; row++) {
        const next = moveFocus({ row, col: 0 }, 'left');
        expect(next).toEqual({ row, col: 0 });
      }
    });

    it('traps at right edge of character rows (going right goes nowhere)', () => {
      for (let row = 0; row <= 3; row++) {
        const next = moveFocus({ row, col: 9 }, 'right');
        expect(next).toEqual({ row, col: 9 });
      }
    });

    it('traps at left edge of action row (DEL going left goes nowhere)', () => {
      const next = moveFocus({ row: 4, col: 0 }, 'left');
      expect(next).toEqual({ row: 4, col: 0 });
    });

    it('traps at right edge of action row (CLEAR going right goes nowhere)', () => {
      const next = moveFocus({ row: 4, col: 2 }, 'right');
      expect(next).toEqual({ row: 4, col: 2 });
    });

    it('traps close button horizontally', () => {
      expect(moveFocus({ row: -1, col: 0 }, 'left')).toEqual({ row: -1, col: 0 });
      expect(moveFocus({ row: -1, col: 0 }, 'right')).toEqual({ row: -1, col: 0 });
    });
  });

  describe('Vertical navigation', () => {
    it('moves down through character rows', () => {
      expect(moveFocus({ row: 0, col: 3 }, 'down')).toEqual({ row: 1, col: 3 });
      expect(moveFocus({ row: 1, col: 3 }, 'down')).toEqual({ row: 2, col: 3 });
      expect(moveFocus({ row: 2, col: 3 }, 'down')).toEqual({ row: 3, col: 3 });
    });

    it('moves from row 3 down to SPACE on action row', () => {
      // Columns 3..6 map to SPACE (col 1)
      expect(moveFocus({ row: 3, col: 4 }, 'down')).toEqual({ row: 4, col: 1 });
    });

    it('moves from row 3 down to DEL on action row', () => {
      // Columns 0..2 map to DEL (col 0)
      expect(moveFocus({ row: 3, col: 1 }, 'down')).toEqual({ row: 4, col: 0 });
    });

    it('moves from row 3 down to CLEAR on action row', () => {
      // Columns 7..9 map to CLEAR (col 2)
      expect(moveFocus({ row: 3, col: 8 }, 'down')).toEqual({ row: 4, col: 2 });
    });

    it('traps at bottom limit (row 4 down goes nowhere)', () => {
      expect(moveFocus({ row: 4, col: 0 }, 'down')).toEqual({ row: 4, col: 0 });
      expect(moveFocus({ row: 4, col: 1 }, 'down')).toEqual({ row: 4, col: 1 });
      expect(moveFocus({ row: 4, col: 2 }, 'down')).toEqual({ row: 4, col: 2 });
    });

    it('moves up from row 0 to close button', () => {
      expect(moveFocus({ row: 0, col: 0 }, 'up')).toEqual({ row: -1, col: 0 });
    });

    it('traps at top limit (close button up goes nowhere)', () => {
      expect(moveFocus({ row: -1, col: 0 }, 'up')).toEqual({ row: -1, col: 0 });
    });
  });
});
