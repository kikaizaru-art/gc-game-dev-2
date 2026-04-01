'use strict';

/**
 * パズル盤面クラス
 * 6列×13行（12行表示+1行隠し）のグリッド管理
 */
class Board {
  constructor() {
    /** @type {(Stone|null)[][]} 行×列の2次元配列 */
    this.grid = [];
    this.init();
  }

  /** グリッドを空で初期化 */
  init() {
    this.grid = [];
    for (let row = 0; row < BOARD_TOTAL_ROWS; row++) {
      this.grid[row] = new Array(BOARD_COLS).fill(null);
    }
  }

  /** 石を配置 */
  placeStone(row, col, stone) {
    if (!this.isInBounds(row, col)) return false;
    this.grid[row][col] = stone;
    stone.row = row;
    stone.col = col;
    return true;
  }

  /** 石を除去 */
  removeStone(row, col) {
    if (!this.isInBounds(row, col)) return null;
    const stone = this.grid[row][col];
    this.grid[row][col] = null;
    return stone;
  }

  /** 指定位置の石を取得 */
  getStone(row, col) {
    if (!this.isInBounds(row, col)) return null;
    return this.grid[row][col];
  }

  /** 座標が盤面内かチェック */
  isInBounds(row, col) {
    return row >= 0 && row < BOARD_TOTAL_ROWS && col >= 0 && col < BOARD_COLS;
  }

  /** 指定位置が空かチェック */
  isEmpty(row, col) {
    return this.isInBounds(row, col) && this.grid[row][col] === null;
  }

  /** 指定列の最も低い空行を取得（重力用） */
  getLowestEmptyRow(col) {
    for (let row = BOARD_TOTAL_ROWS - 1; row >= 0; row--) {
      if (this.grid[row][col] === null) return row;
    }
    return -1;
  }

  /** ゲームオーバー判定（隠し行に石があるか） */
  isGameOver() {
    for (let col = 0; col < BOARD_COLS; col++) {
      if (this.grid[0][col] !== null) return true;
    }
    return false;
  }

  /** 呪い鎖ブロックの残数 */
  getCurseBlockCount() {
    let count = 0;
    for (let row = 0; row < BOARD_TOTAL_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        if (this.grid[row][col] && this.grid[row][col].isCurse) {
          count++;
        }
      }
    }
    return count;
  }

  /** ステージクリア判定 */
  isStageClear() {
    return this.getCurseBlockCount() === 0;
  }

  /**
   * ステージデータから呪い鎖ブロックを配置
   * @param {Array<{row: number, col: number}>} curseBlocks
   */
  loadStage(curseBlocks) {
    this.init();
    for (const pos of curseBlocks) {
      const curse = StoneFactory.createCurse();
      this.placeStone(pos.row, pos.col, curse);
    }
  }
}
