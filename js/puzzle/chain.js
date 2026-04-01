'use strict';

/**
 * 連鎖解決クラス
 * マッチ判定→消去→重力→再判定のステートマシン
 */
class ChainResolver {
  constructor() {
    this.reset();
  }

  /** 状態リセット */
  reset() {
    this.state = 'idle';
    this.chainCount = 0;
    this.totalCleared = 0;
    this.score = 0;
    this.pendingMatches = [];
    this.pendingCurses = [];
  }

  /** 連鎖解決を開始 */
  startResolve() {
    this.state = 'checking';
    this.chainCount = 0;
    this.totalCleared = 0;
    this.score = 0;
  }

  /**
   * 1ステップ進める（PuzzleSceneがタイマーで呼ぶ）
   * @param {Board} board
   * @returns {Object} アニメーション用の結果データ
   */
  step(board) {
    switch (this.state) {
      case 'checking':
        return this.stepChecking(board);
      case 'clearing':
        return this.stepClearing(board);
      case 'gravity':
        return this.stepGravity(board);
      default:
        return { type: 'idle' };
    }
  }

  /** マッチ判定ステップ */
  stepChecking(board) {
    const matches = this.findMatches(board);

    if (matches.length > 0) {
      this.chainCount++;
      this.pendingMatches = matches;

      // 消去位置を平坦化して隣接呪いブロックを検索
      const allPositions = matches.flat();
      this.pendingCurses = CurseBlockHelper.findAdjacentCurses(board, allPositions);

      this.state = 'clearing';
      return {
        type: 'match',
        matches: matches,
        curses: this.pendingCurses,
        chainCount: this.chainCount
      };
    }

    // マッチなし → 連鎖終了
    const result = {
      type: 'done',
      chainCount: this.chainCount,
      totalCleared: this.totalCleared,
      score: this.score
    };
    this.state = 'idle';
    return result;
  }

  /** 消去ステップ */
  stepClearing(board) {
    const cleared = [];

    // マッチした石を消去
    for (const group of this.pendingMatches) {
      for (const pos of group) {
        const stone = board.removeStone(pos.row, pos.col);
        if (stone) {
          cleared.push(pos);
          this.totalCleared++;
        }
      }
    }

    // 呪い鎖ブロックを消去
    const cursesRemoved = [];
    for (const pos of this.pendingCurses) {
      const stone = board.removeStone(pos.row, pos.col);
      if (stone) {
        cursesRemoved.push(pos);
      }
    }

    // スコア加算
    const multiplierIndex = Math.min(this.chainCount, CHAIN_MULTIPLIER.length - 1);
    this.score += cleared.length * BASE_SCORE * CHAIN_MULTIPLIER[multiplierIndex];

    this.state = 'gravity';
    return {
      type: 'clear',
      cleared: cleared,
      cursesRemoved: cursesRemoved,
      chainCount: this.chainCount
    };
  }

  /** 重力ステップ */
  stepGravity(board) {
    const movements = this.applyGravity(board);
    this.state = 'checking';
    return {
      type: 'gravity',
      movements: movements
    };
  }

  /**
   * BFS flood fillでマッチグループを検索
   * @param {Board} board
   * @returns {Array<Array<{row: number, col: number}>>} マッチしたグループ群
   */
  findMatches(board) {
    const visited = new Set();
    const groups = [];

    for (let row = 0; row < BOARD_TOTAL_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        const key = `${row},${col}`;
        if (visited.has(key)) continue;

        const stone = board.getStone(row, col);
        if (!stone || stone.isCurse) continue;

        // BFSで同色連結グループを探索
        const group = [];
        const queue = [{ row, col }];
        visited.add(key);

        while (queue.length > 0) {
          const current = queue.shift();
          group.push(current);

          for (const dir of CurseBlockHelper.DIRECTIONS) {
            const nRow = current.row + dir.row;
            const nCol = current.col + dir.col;
            const nKey = `${nRow},${nCol}`;

            if (visited.has(nKey)) continue;

            const neighbor = board.getStone(nRow, nCol);
            if (neighbor && !neighbor.isCurse && neighbor.color === stone.color) {
              visited.add(nKey);
              queue.push({ row: nRow, col: nCol });
            }
          }
        }

        if (group.length >= MATCH_MIN) {
          groups.push(group);
        }
      }
    }

    return groups;
  }

  /**
   * 重力適用：空きセルに石を落下
   * @param {Board} board
   * @returns {Array<{fromRow: number, toRow: number, col: number}>}
   */
  applyGravity(board) {
    const movements = [];

    for (let col = 0; col < BOARD_COLS; col++) {
      let writeRow = BOARD_TOTAL_ROWS - 1;

      for (let readRow = BOARD_TOTAL_ROWS - 1; readRow >= 0; readRow--) {
        const stone = board.getStone(readRow, col);
        if (stone !== null) {
          if (readRow !== writeRow) {
            board.removeStone(readRow, col);
            board.placeStone(writeRow, col, stone);
            movements.push({ fromRow: readRow, toRow: writeRow, col: col });
          }
          writeRow--;
        }
      }
    }

    return movements;
  }
}
