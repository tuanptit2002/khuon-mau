import Resizer from "react-image-file-resizer";

export const resizeFile = (file, maxWidth = 800, maxHeight = 1000) => new Promise(resolve => {
    const fileExt = getFileExtension(file.name)

    let compressFormat = "JPEG"

    if (fileExt.toLowerCase() === '.png')
        compressFormat = "PNG"
    else if (fileExt.toLowerCase() === '.webp')
        compressFormat = "WEBP"

    Resizer.imageFileResizer(file, maxWidth, maxHeight, compressFormat, 80, 0,
        resizefile => {
            resolve(resizefile);
        }, 'file');
});

export const getFileExtension = (filename) => filename.substring(filename.lastIndexOf('.')) || ''