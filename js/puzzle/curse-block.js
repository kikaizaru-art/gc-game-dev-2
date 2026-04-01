'use strict';

/**
 * 呪い鎖ブロック ヘルパー
 * 消去された石に隣接する呪いブロックを検出
 */
class CurseBlockHelper {
  /** 4方向オフセット */
  static DIRECTIONS = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
  ];

  /**
   * 消去位置に隣接する呪い鎖ブロックを検索
   * @param {Board} board
   * @param {Array<{row: number, col: number}>} clearedPositions - 消去された石の位置
   * @returns {Array<{row: number, col: number}>} 破壊すべき呪いブロック位置
   */
  static findAdjacentCurses(board, clearedPositions) {
    const curseSet = new Set();

    for (const pos of clearedPositions) {
      for (const dir of CurseBlockHelper.DIRECTIONS) {
        const nRow = pos.row + dir.row;
        const nCol = pos.col + dir.col;
        const stone = board.getStone(nRow, nCol);

        if (stone && stone.isCurse) {
          const key = `${nRow},${nCol}`;
          if (!curseSet.has(key)) {
            curseSet.add(key);
          }
        }
      }
    }

    return Array.from(curseSet).map(key => {
      const [row, col] = key.split(',').map(Number);
      return { row, col };
    });
  }
}
