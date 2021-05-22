import FileSaver from 'file-saver';
import { useState } from 'react';

type Params = {
  canvas: HTMLCanvasElement | null;
  video: HTMLVideoElement | null;
  type?: string;
  quality?: number;
  filename?: string;
};

export function useScreenshot() {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState(null);

  const takeScreenShotAndSave = async ({ canvas, video, type, quality, filename }: Params) => {
    try {
      if (canvas && video) {
        const ctx = canvas.getContext('2d');
        const width = video.videoWidth;
        const height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;
        ctx?.fillRect(0, 0, width, height);
        ctx?.drawImage(video, 0, 0, width, height);

        const base64Image = canvas.toDataURL(type, quality);

        video.style.height = height.toString();
        video.style.width = width.toString();
        video.src = base64Image;

        FileSaver.saveAs(base64Image, filename);

        ctx?.clearRect(0, 0, width, height);

        setImage(base64Image);

        return base64Image;
      } else {
        throw new Error('You need to provide a canvas and video ref');
      }
    } catch (error) {
      setError(error);
    }
  };

  return {
    image,
    takeScreenShotAndSave,
    error
  };
}
