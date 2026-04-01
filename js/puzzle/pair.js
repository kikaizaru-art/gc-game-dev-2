'use strict';

/**
 * 落下ペアクラス
 * 2つの魔力石の組を制御（移動・回転・落下・ロック）
 */
class Pair {
  constructor() {
    this.pivotStone = null;
    this.satelliteStone = null;
    this.pivotRow = 0;
    this.pivotCol = 0;
    /** 0=上, 1=右, 2=下, 3=左 */
    this.rotation = 0;
    this.locked = false;
  }

  /** 回転方向に応じた衛星石のオフセット */
  static OFFSETS = [
    { row: -1, col: 0 },  // 0: 上
    { row: 0, col: 1 },   // 1: 右
    { row: 1, col: 0 },   // 2: 下
    { row: 0, col: -1 }   // 3: 左
  ];

  /** 新しいペアを生成して初期位置に配置 */
  spawn() {
    this.pivotStone = StoneFactory.createRandom();
    this.satelliteStone = StoneFactory.createRandom();
    this.pivotRow = PAIR_SPAWN_ROW;
    this.pivotCol = PAIR_SPAWN_COL;
    this.rotation = 0;
    this.locked = false;
  }

  /** 衛星石の現在位置を取得 */
  getSatellitePosition() {
    const offset = Pair.OFFSETS[this.rotation];
    return {
      row: this.pivotRow + offset.row,
      col: this.pivotCol + offset.col
    };
  }

  /** 両石が指定方向に移動可能か判定 */
  canMove(board, dRow, dCol) {
    const newPivotRow = this.pivotRow + dRow;
    const newPivotCol = this.pivotCol + dCol;
    const satPos = this.getSatellitePosition();
    const newSatRow = satPos.row + dRow;
    const newSatCol = satPos.col + dCol;

    return board.isEmpty(newPivotRow, newPivotCol) &&
           board.isEmpty(newSatRow, newSatCol);
  }

  /** 左移動 */
  moveLeft(board) {
    if (this.locked) return false;
    if (this.canMove(board, 0, -1)) {
      this.pivotCol--;
      return true;
    }
    return false;
  }

  /** 右移動 */
  moveRight(board) {
    if (this.locked) return false;
    if (this.canMove(board, 0, 1)) {
      this.pivotCol++;
      return true;
    }
    return false;
  }

  /** 下移動（falseで着地判定） */
  moveDown(board) {
    if (this.locked) return false;
    if (this.canMove(board, 1, 0)) {
      this.pivotRow++;
      return true;
    }
    return false;
  }

  /**
   * 時計回りに回転（壁キック付き）
   * @returns {boolean} 回転成功したか
   */
  rotate(board) {
    if (this.locked) return false;

    const newRotation = (this.rotation + 1) % 4;
    const offset = Pair.OFFSETS[newRotation];
    const newSatRow = this.pivotRow + offset.row;
    const newSatCol = this.pivotCol + offset.col;

    // そのまま回転できるか
    if (board.isEmpty(newSatRow, newSatCol)) {
      this.rotation = newRotation;
      return true;
    }

    // 壁キック: 衛星と反対方向にピボットをずらす
    const kickDRow = -offset.row;
    const kickDCol = -offset.col;
    const kickedPivotRow = this.pivotRow + kickDRow;
    const kickedPivotCol = this.pivotCol + kickDCol;
    const kickedSatRow = kickedPivotRow + offset.row;
    const kickedSatCol = kickedPivotCol + offset.col;

    if (board.isEmpty(kickedPivotRow, kickedPivotCol) &&
        board.isEmpty(kickedSatRow, kickedSatCol)) {
      this.pivotRow = kickedPivotRow;
      this.pivotCol = kickedPivotCol;
      this.rotation = newRotation;
      return true;
    }

    return false;
  }

  /**
   * ペアを盤面に固定
   * 各石は自列の最下空行に落下する
   */
  lock(board) {
    this.locked = true;
    const satPos = this.getSatellitePosition();

    // ピボット石を自列の最下行に配置
    const pivotTargetRow = board.getLowestEmptyRow(this.pivotCol);
    if (pivotTargetRow >= 0) {
      board.placeStone(pivotTargetRow, this.pivotCol, this.pivotStone);
    }

    // 衛星石を自列の最下行に配置
    const satTargetRow = board.getLowestEmptyRow(satPos.col);
    if (satTargetRow >= 0) {
      board.placeStone(satTargetRow, satPos.col, this.satelliteStone);
    }
  }
}
