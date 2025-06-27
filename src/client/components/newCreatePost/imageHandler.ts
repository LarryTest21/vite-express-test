export interface IResizeImageOptions {
  maxSize: number;
  file: File;
}

const dataURItoBlob = (dataURI: string): Blob => {
  const bytes =
    dataURI.split(",")[0].includes("base64")
      ? atob(dataURI.split(",")[1])
      : unescape(dataURI.split(",")[1]);
  const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ia = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) ia[i] = bytes.charCodeAt(i);
  return new Blob([ia], { type: mime });
};

export const resizeImage = ({ maxSize, file }: IResizeImageOptions): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      reject(new Error("Not an image"));
      return;
    }

    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement("canvas");

    reader.onload = (readerEvent) => {
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataURItoBlob(dataUrl));
      };

      image.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
