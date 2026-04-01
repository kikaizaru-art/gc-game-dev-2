'use strict';

/**
 * ヒロイン管理クラス
 * 表情・セリフデータの管理
 */
class HeroineManager {
  constructor() {
    this.heroines = {};
    this.selectedHeroine = null;
  }

  /** ヒロインデータを設定（MVP用ハードコード） */
  loadDefaultData() {
    this.heroines = {
      luna: {
        id: 'luna',
        name: 'ルナ',
        color: '#bb88ff',
        emoji: '🌙',
        expressions: {
          neutral: { emoji: '😐', text: '…助けて…' },
          smile: { emoji: '😊', text: 'すごい…！' },
          surprised: { emoji: '😲', text: 'え、えぇ!? すごい連鎖！' },
          ecstatic: { emoji: '🥰', text: 'きゃあああ！かっこいい！' },
          victory: { emoji: '😭✨', text: '…ありがとう。やっと呪いが解けた…！' },
          defeat: { emoji: '😢', text: '…まだ、暗いの…助けて…' }
        },
        chainThresholds: {
          smile: 1,
          surprised: 3,
          ecstatic: 5
        }
      }
    };
  }

  /** ヒロインを選択 */
  selectHeroine(id) {
    this.selectedHeroine = this.heroines[id] || null;
    return this.selectedHeroine;
  }

  /** 連鎖数に応じた表情キーを取得 */
  getExpression(chainCount) {
    if (!this.selectedHeroine) return 'neutral';
    const thresholds = this.selectedHeroine.chainThresholds;

    if (chainCount >= thresholds.ecstatic) return 'ecstatic';
    if (chainCount >= thresholds.surprised) return 'surprised';
    if (chainCount >= thresholds.smile) return 'smile';
    return 'neutral';
  }

  /** 表情データを取得 */
  getExpressionData(expressionKey) {
    if (!this.selectedHeroine) return null;
    return this.selectedHeroine.expressions[expressionKey] || null;
  }

  /** 勝利データ */
  getVictoryData() {
    return this.getExpressionData('victory');
  }

  /** 敗北データ */
  getDefeatData() {
    return this.getExpressionData('defeat');
  }
}
