'use strict';

/**
 * 魔力石クラス
 * パズル盤面上の個々の石を表現する純データクラス
 */
class Stone {
  /**
   * @param {string} color - STONE_COLORSのいずれか、または'curse'
   * @param {boolean} isCurse - 呪い鎖ブロックかどうか
   */
  constructor(color, isCurse = false) {
    this.color = color;
    this.isCurse = isCurse;
    this.row = -1;
    this.col = -1;
    this.isClearing = false;
  }
}

/**
 * 石の生成ファクトリ
 */
class StoneFactory {
  /** ランダムな色の石を生成 */
  static createRandom() {
    const color = STONE_COLORS[Math.floor(Math.random() * STONE_COLORS.length)];
    return new Stone(color);
  }

  /** 呪い鎖ブロックを生成 */
  static createCurse() {
    return new Stone('curse', true);
  }

  /** 指定色の石を生成 */
  static createWithColor(color) {
    return new Stone(color);
  }
}
