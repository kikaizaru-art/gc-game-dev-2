# コンセプトアート生成プロンプト集
# 対象: Gemini API (Imagen 3)
# 目的: 「マジカル・ハート・レスキュー」全体のビジュアル統一

---

## 0. 共通スタイルディレクティブ（全プロンプトの先頭に付与）

```
Style directive: Japanese anime-inspired 2D illustration, soft cel-shading,
pastel-to-vibrant color palette centered on pink (#ec4899), purple (#8b5cf6),
and amber (#f59e0b) against a deep dark-blue (#0a0a1a) background.
Aesthetic: magical girl meets gothic academy. Clean line art suitable for
a puzzle game UI. No photorealism. Consistent across all outputs.
```

---

## 1. ワールドコンセプト — 呪われた学園の全景

### 1-A. 学園外観（昼 → 呪い状態）

```
[Style directive を先頭に挿入]

Scene: A grand Japanese high school academy building on a hilltop, viewed from
a low angle. Gothic-inspired architecture with arched windows and a clock tower.
The left half shows the school in warm daylight with cherry blossoms.
The right half is engulfed in creeping dark-purple cursed energy — windows glow
an ominous violet, thorny shadow vines crawl up the walls, and the sky turns
deep indigo with floating chain-link fragments.

Composition: Wide establishing shot, 16:9 aspect ratio.
Mood: Contrast between hope and corruption — the core theme of the game.
Key colors: Warm amber + pink (light side) vs deep purple + dark blue (cursed side).
No characters in frame. Focus on environment and atmosphere.
```

### 1-B. 学園内部 — 呪いの回廊

```
[Style directive を先頭に挿入]

Scene: A long school corridor at night. Moonlight streams through tall Gothic
windows on the left. The floor reflects purple-tinted light. Floating translucent
chain fragments and curse runes drift in the air. At the far end, a faint
pink-and-gold magical glow suggests hope — the player's power.

Details: Shoe lockers partially wrapped in shadow tendrils. A bulletin board
with papers fluttering unnaturally. Faint heart-shaped sparkles near the
glowing end of the hallway.

Composition: One-point perspective, vanishing point at the glowing far end.
Mood: Mysterious, slightly eerie, but with a warm undertone of rescue and hope.
```

---

## 2. パズル盤面コンセプト — ゲームプレイの世界観

### 2-A. パズルフィールド背景

```
[Style directive を先頭に挿入]

Scene: Abstract magical background for a falling-block puzzle game field.
A 6-column vertical grid area (center of frame) is implied by faint
glowing grid lines in soft pink. Around the grid, swirling magical energy
in purple and blue tones. Small floating heart particles and star fragments
orbit the edges. The bottom of the field has a subtle floor of crystallized
curse fragments (dark gray-purple).

Style: Atmospheric, not distracting — this is a gameplay background.
Must remain visually readable when colorful puzzle pieces are placed on top.
Composition: Portrait orientation (9:16), grid area centered.
Color notes: Background must be dark (near #0a0a1a) to ensure colored stones
(red #ff4466, blue #4488ff, green #44dd66, yellow #ffcc00, purple #bb44ff)
remain clearly visible.
```

### 2-B. ストーン（ぷよ）デザインコンセプト

```
[Style directive を先頭に挿入]

Design: Five magical gemstone-heart hybrids for a puzzle game, arranged in a row.
Each is a rounded, slightly squishy gem shaped like a stylized heart with
a small sparkle highlight.

Colors (left to right):
1. Red (#ff4466) — fire ruby heart, tiny flame wisps
2. Blue (#4488ff) — ocean sapphire heart, water droplet sheen
3. Green (#44dd66) — forest emerald heart, small leaf accent
4. Yellow (#ffcc00) — sun topaz heart, warm glow aura
5. Purple (#bb44ff) — mystic amethyst heart, crescent moon mark

Each stone is ~40px conceptual size, with consistent proportions.
Style: Cute but slightly elegant. Soft inner glow. 2D flat with minimal shading.
Background: Transparent / dark field for contrast reference.
Also include: One "curse block" — a dark gray (#555555) cube wrapped in
chain links with a small padlock, visually distinct from the heart stones.
```

---

## 3. キャラクターコンセプト — ルナ（最初のヒロイン）

### 3-A. ルナ キャラクターシート

```
[Style directive を先頭に挿入]

Character design sheet for "Luna" (ルナ), a soft-spoken high school girl
trapped by a curse.

Appearance: Long wavy silver-lavender hair reaching mid-back. Large gentle
violet eyes with a faint crescent moon reflection. Pale skin. Slender build.
Age appearance: 16-17.

Outfit: Dark purple school uniform (blazer + plaid skirt) partially wrapped
in translucent shadow chains (the curse). A small crescent moon hair clip
on her left side. When freed from the curse, faint pink heart sparkles
replace the chains.

Expressions (show 4 on the sheet):
1. Neutral/trapped — downcast eyes, shadowy aura, chains visible
2. Smile — gentle warm smile, eyes brightening, chains fading
3. Surprised — wide eyes, hands near face, sparkle effects
4. Ecstatic/freed — radiant smile, arms open, full magical glow,
   no chains, heart particles everywhere

Layout: Full body center + 4 expression busts around the edges.
Background: Simple gradient (dark purple to dark blue).
Color palette strip at bottom: #bb88ff, #8b5cf6, #0a0a1a, #ec4899, #f59e0b
```

### 3-B. ルナ ポートレート（ゲーム内UI用）

```
[Style directive を先頭に挿入]

Portrait illustration of Luna (ルナ) for a game UI panel (200×260px target).
Bust-up composition (head to upper chest). She faces slightly left (3/4 view).

Expression: Neutral — gentle but sad eyes, looking at the viewer with a quiet
plea for help. Faint purple shadow aura around her shoulders suggests the curse.
A small crescent moon hair clip glows softly.

Background: Solid dark purple (#2a1a3e) with subtle magical particle overlay.
Hair: Silver-lavender, softly flowing.
Eyes: Deep violet with visible crescent moon highlight.
Uniform: Dark purple blazer collar visible.

Art direction: Clean line art, soft coloring, anime-style. Must read clearly
at small display sizes. High contrast between character and background.
```

---

## 4. UI コンセプト — 画面レイアウト

### 4-A. タイトル画面コンセプト

```
[Style directive を先頭に挿入]

Title screen mockup for "マジカル・ハート・レスキュー" (Magical Heart Rescue).
Subtitle: "〜呪われし学園と乙女の連鎖〜"

Layout: The cursed academy building in the background (upper half), dark and
atmospheric with purple energy swirling around the clock tower.
In the foreground (lower half), Luna stands in silhouette with faint
purple chains, but a bright pink-gold magical light emanates from the
center where the title text is displayed.

Title text: Large, decorative Japanese font with pink-to-gold gradient fill
and a soft white glow. Heart symbols integrated into the design.
Subtitle: Smaller, elegant, white text below.

A glowing pink "▶ スタート" button floats at the bottom with a gentle
pulsing aura.

Floating particles: Hearts, stars, and chain fragments drift across the scene.
Color palette: Dark background, vibrant pink/purple/gold foreground elements.
Aspect ratio: 16:9 (landscape, 800×600 game resolution).
```

### 4-B. ゲームプレイ画面レイアウト

```
[Style directive を先頭に挿入]

Game UI layout mockup for a falling-block puzzle game.

Left side: Score display and chain counter with magical ornamental frame
(pink-gold decorative borders). Current score in large amber numbers.
Chain counter appears dramatically during combos with radiating light effects.

Center: The 6×12 puzzle grid (240×480px area) with dark background and
faint pink grid lines. Example stones (heart-shaped gems) are placed
showing an active game state. A falling pair is mid-descent.

Right side: Heroine UI panel (260px wide). Luna's portrait at top in an
ornate frame with curse-themed decorations. Below: her name "ルナ" in
purple text, a dialogue bubble with Japanese text, and a curse block
counter showing remaining blocks to clear.

Top bar: Stage name "はじめての救出" centered.
Overall frame: Dark with magical decorative elements at corners.
Aspect ratio: 4:3 area (800×600 game resolution).
```

---

## 5. エフェクトコンセプト

### 5-A. 連鎖エフェクト演出

```
[Style directive を先頭に挿入]

Visual effects concept sheet for a puzzle game chain/combo system.
Show 4 stages of escalating chain effects:

1-chain: Small pink sparkle burst where stones are cleared.
  Subtle, minimal particles.

2-chain: Larger burst with pink and purple particles swirling outward.
  Faint ring of light expands from the clear point.

3-chain: Dramatic burst — golden light rays shoot upward, hearts and
  stars scatter, the background briefly brightens. Magical circle
  pattern appears momentarily.

5+ chain: Maximum spectacle — full-screen golden-pink radiance,
  large magical heart symbol fills the center, chain fragments
  (curse chains) shatter dramatically, streaming particles of all
  stone colors. The heroine's panel glows with joy.

Layout: 2×2 grid of effect stages. Dark background for each.
Style: VFX concept art — expressive, energetic, readable at small scale.
```

### 5-B. 呪い解除エフェクト

```
[Style directive を先頭に挿入]

Effect concept: A curse block (dark gray cube with chain links and padlock)
being destroyed by adjacent magical energy.

Sequence (left to right, 4 frames):
1. Curse block intact — dark, heavy, chains tight, faint purple glow
2. Cracks appear — pink light seeps through cracks in the chains,
   the padlock trembles
3. Breaking — chains shatter outward, bright pink-gold light erupts
   from within, fragments scatter
4. Cleared — empty space with lingering sparkles, a small freed heart
   floats upward and dissolves into light

Background: Dark puzzle grid for context.
Style: Sequential animation concept art. Clear visual storytelling.
```

---

## 使い方

### Gemini API 呼び出し例（Python）

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

# スタイルディレクティブ
STYLE_DIRECTIVE = """Style directive: Japanese anime-inspired 2D illustration, soft cel-shading,
pastel-to-vibrant color palette centered on pink (#ec4899), purple (#8b5cf6),
and amber (#f59e0b) against a deep dark-blue (#0a0a1a) background.
Aesthetic: magical girl meets gothic academy. Clean line art suitable for
a puzzle game UI. No photorealism. Consistent across all outputs."""

def generate_concept_art(prompt_body, output_path):
    """コンセプトアートを生成"""
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    full_prompt = f"{STYLE_DIRECTIVE}\n\n{prompt_body}"

    response = model.generate_content(
        full_prompt,
        generation_config=genai.GenerationConfig(
            response_modalities=["image", "text"],
        ),
    )

    # 画像レスポンスの取得
    for part in response.candidates[0].content.parts:
        if part.inline_data:
            with open(output_path, "wb") as f:
                f.write(part.inline_data.data)
            print(f"Saved: {output_path}")
            return
    print("No image generated")

# 使用例
generate_concept_art(
    "Scene: A grand Japanese high school academy building on a hilltop...",
    "assets/images/concept-academy.png"
)
```

---

## 生成順序（推奨）

1. **1-A 学園外観** → 世界観の基盤を確立
2. **2-B ストーンデザイン** → ゲームの核ビジュアルを確定
3. **3-A ルナ キャラクターシート** → メインキャラの方向性を決定
4. **3-B ルナ ポートレート** → キャラシートを参考に統一
5. **2-A パズル背景** → ストーンが映える背景を調整
6. **4-B ゲームプレイ画面** → 全要素を統合したレイアウト確認
7. **4-A タイトル画面** → 最終的な第一印象を仕上げ
8. **5-A/5-B エフェクト** → ゲームプレイの演出を補完
