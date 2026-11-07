/** Downscales an uploaded image to fit browser storage and returns it as a WebP data URL. */
export function compressImage(file: File, max = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas
        .getContext("2d")!
        .drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/webp", 0.75));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
