import { IconPlate } from './Icons';
import { useState } from 'react';
import type { Recipe } from '../lib/types';

/** Картинка блюда, а если её нет или она не загрузилась — нежная плашка с тарелкой */
export function RecipePic({ recipe, className = '' }: { recipe: Pick<Recipe, 'image' | 'emoji' | 'name'>; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (recipe.image && failedSrc !== recipe.image) {
    return (
      <img
        className={`${className} pic-img`}
        src={recipe.image}
        alt={recipe.name}
        loading="lazy"
        draggable={false}
        onError={() => setFailedSrc(recipe.image!)}
      />
    );
  }
  // Нет фото — нежная матовая плашка с тонкой тарелкой; оттенок зависит от названия
  let h = 0;
  for (const ch of recipe.name ?? '') h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (
    <span className={`${className} pic-emoji pic-ph tone-${h % 3}`} role="img" aria-label={recipe.name}>
      <IconPlate />
    </span>
  );
}

/** Фото с телефона → квадратная сжатая картинка (хранится прямо в рецепте) */
export async function photoToDataUrl(file: File, size = 480): Promise<string> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, size, size);
  bmp.close();
  return canvas.toDataURL('image/jpeg', 0.8);
}
