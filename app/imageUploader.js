import Promise from "bluebird";
import PdfJs from "pdfjs-dist";
import PdfJsWorker from "pdfjs-dist/build/pdf.worker";


const MAX_SIZE = 1000000;

export default class ImageUploader {
  uploadToClient(file) {
      console.log("new");

    // TODO: refactor into smaller functions
    return new Promise((resolve, reject) => {
      if (file.image.size > MAX_SIZE) {
        reject(new Error("Image is to BIG"));
      } else {
        const reader = new FileReader();

        reader.onerror = () => {
          reject("Something went wrong when uploading the file");
        };

        reader.onload = event => {
          PdfJs.worker = PdfJsWorker;
          const result = event.currentTarget.result;

          // PDF fix since PDF files does not play well with FabricJS
          // Takes the b64string representing the pdf and converts it to
          // a Uint8Array so PdfJs can read it
          // Then draws it on a canvas elements and then converts to a PNG
          // to finally draw it on the main (fabric) canvas
          if (file.type === "application/pdf") {
            const pdfAsArray = convertDataURIToBinary(result);
            PdfJs.getDocument(pdfAsArray).then(pdf => {
              pdf.getPage(1).then(page => {
                const viewport = page.getViewport(1.5);
                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext("2d");

                const renderContext = {
                  canvasContext: context,
                  viewport
                };

                // PDFJs callback for pageRenering so the image is fully drawn
                // on the canvas before resolving the promise
                const pageRendering = page.render(renderContext);
                const completeCallback = pageRendering._internalRenderTask.callback;

                pageRendering._internalRenderTask.callback = function(error) {
                  resolve(canvas.toDataURL("png"));
                  completeCallback.call(this, error);
                };
              });
            });
          } else {
            resolve(event.currentTarget.result);
          }
        };
        reader.readAsDataURL(file.image);
      }
    });
  }

  isValidImage(image) {
    // http://stackoverflow.com/a/29672957 how to check the real mime-type in js
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = event => {
        const arr = (new Uint8Array(event.target.result)).subarray(0, 4);
        let header = "";

        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        let type = "";
        switch (header) {
          case "89504e47":
            type = "image/png";
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
            type = "image/jpeg";
            break;
          case "25504446":
            type = "application/pdf";
            break;
          default:
            type = "unknown"; // Or you can use the blob.type as fallback
            break;
        }
        console.log("isValidImage");
        console.log(image);
        if (image.size > MAX_SIZE) {
          reject(new Error("Image size exceeds the max allowed"));
        } else if (type === "image/jpeg" || type === "image/png" || type === "application/pdf") {
          resolve({ image, type });
        } else {
          reject(new Error("Not a valid image"));
        }
      };
      reader.readAsArrayBuffer(image);
    });
  }
}

function convertDataURIToBinary(dataURI) {
  // Used to convert a base64 representation of a pdf to
  // a binary array
  const BASE64_MARKER = ';base64,';
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  console.log(array);
  return array;
}
