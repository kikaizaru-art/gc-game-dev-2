'use strict';

/**
 * ヒロインUI描画クラス
 * DOM overlayでポートレート・セリフを表示
 */
class HeroineUI {
  constructor() {
    this.overlay = document.getElementById('ui-overlay');
    this.panel = null;
    this.portrait = null;
    this.nameEl = null;
    this.dialogue = null;
    this.currentExpression = 'neutral';
    this.createElements();
  }

  /** DOM要素を作成 */
  createElements() {
    this.panel = document.createElement('div');
    this.panel.className = 'heroine-panel';
    this.panel.style.display = 'none';

    // ポートレート
    this.portrait = document.createElement('div');
    this.portrait.className = 'heroine-portrait';
    this.panel.appendChild(this.portrait);

    // 名前
    this.nameEl = document.createElement('div');
    this.nameEl.className = 'heroine-name';
    this.panel.appendChild(this.nameEl);

    // セリフバブル
    this.dialogue = document.createElement('div');
    this.dialogue.className = 'dialogue-bubble';
    this.panel.appendChild(this.dialogue);

    this.overlay.appendChild(this.panel);
  }

  /**
   * ヒロインを表示
   * @param {Object} heroine - HeroineManagerのヒロインデータ
   */
  show(heroine) {
    if (!heroine) return;
    this.panel.style.display = 'block';
    this.nameEl.textContent = heroine.name;
    this.nameEl.style.color = heroine.color;
    this.portrait.style.borderColor = heroine.color;

    // 初期表情
    this.updateExpression(heroine.expressions.neutral);
  }

  /** 非表示 */
  hide() {
    this.panel.style.display = 'none';
  }

  /**
   * 表情を更新
   * @param {Object} expressionData - { emoji, text }
   */
  updateExpression(expressionData) {
    if (!expressionData) return;
    this.portrait.textContent = expressionData.emoji;

    // セリフ表示
    this.showDialogue(expressionData.text);
  }

  /**
   * セリフをタイプライター風に表示
   * @param {string} text
   */
  showDialogue(text) {
    this.dialogue.classList.add('visible');
    this.dialogue.textContent = '';

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        this.dialogue.textContent += text[index];
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 40);

    // 数秒後にフェードアウト
    clearTimeout(this.dialogueTimeout);
    this.dialogueTimeout = setTimeout(() => {
      this.dialogue.classList.remove('visible');
    }, 4000);
  }

  /** 勝利演出 */
  playVictory(data) {
    if (!data) return;
    this.portrait.classList.add('excited');
    this.updateExpression(data);
  }

  /** 敗北演出 */
  playDefeat(data) {
    if (!data) return;
    this.portrait.style.filter = 'brightness(0.5)';
    this.updateExpression(data);
  }

  /** リセット */
  reset() {
    this.portrait.classList.remove('excited');
    this.portrait.style.filter = '';
    this.dialogue.classList.remove('visible');
  }
}
