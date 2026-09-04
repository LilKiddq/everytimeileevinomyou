export interface RGB {
  r: number;
  g: number;
  b: number;
}

export async function extractDominantColor(
  imageUrl: string,
  quality = 30
): Promise<RGB> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ r: 30, g: 30, b: 40 });
          return;
        }
        const w = Math.min(img.width, quality * 2);
        const h = Math.min(img.height, quality * 2);
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;

        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 128) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count === 0) {
          resolve({ r: 30, g: 30, b: 40 });
          return;
        }
        resolve({
          r: Math.round(r / count),
          g: Math.round(g / count),
          b: Math.round(b / count),
        });
      } catch {
        resolve({ r: 30, g: 30, b: 40 });
      }
    };
    img.onerror = () => resolve({ r: 30, g: 30, b: 40 });
    img.src = imageUrl;
  });
}

export function rgbToCss(
  { r, g, b }: RGB,
  opacity = 1
): string {
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
