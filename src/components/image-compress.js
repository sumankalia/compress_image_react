import React from "react";
import imageCompression from "browser-image-compression";

const units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

function niceBytes(x) {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}
const imageSize = (file) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);

  const promise = new Promise((resolve, reject) => {
    reader.onload = function (e) {
      const image = new Image();

      image.src = e.target.result;

      image.onload = function () {
        const height = this.height;
        const width = this.width;

        resolve({ width, height });
      };

      image.onerror = reject;
    };
  });

  return promise;
};

const ImageCompressor = () => {
  const compressImage = async (file) => {
    const imageDimensions = await imageSize(file);
    console.log({ imageDimensions, size: niceBytes(file.size) });

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight:
        imageDimensions?.width > 1300 ? 1300 : imageDimensions?.width,
      useWebWorker: true,
    };

    const compressedImg = await imageCompression(file, options);

    return compressedImg;
  };

  const uploadImage = async (files) => {
    const image = await compressImage(files[0]);
    const imageDimensions = await imageSize(image);

    console.log({ Compressed: imageDimensions, size: niceBytes(image.size) });
  };
  return (
    <div style={{ width: "600px", margin: "20px auto" }}>
      <form>
        <div className="col">
          <input
            className="form-control"
            type="file"
            onChange={(e) => uploadImage(e.target.files)}
          />
        </div>
      </form>
    </div>
  );
};

export default ImageCompressor;
