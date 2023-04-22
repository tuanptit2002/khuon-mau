import firebase from "firebase/compat/app";
import 'firebase/compat/storage';
import { resizeFile } from "../utils/FileUtils";

export const requestUploadImage = async (path, file, maxWidth = 800, maxHeight = 1000) => {
  const newFile = await resizeFile(file, maxWidth, maxHeight);

  const metadata = {
    cacheControl: 'public,max-age=31536000'
  };

  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef.child(path).put(newFile, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        console.log(snapshot.bytesTransferred * 100 / snapshot.totalBytes);
      },
      (error) => { reject(error); },
      () => {
        // Handle successful uploads on complete production
        // resolve(`https://jmaster.io/resources/${path}`)
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          const originUrl = downloadURL.replace('https://firebasestorage.googleapis.com/v0/b/gplx-3985c.appspot.com/o/', "");
          const index = originUrl.indexOf("?");
          const originPath = originUrl.substring(0, index);

          const targetURL = `https://onthibanglaixe.net/assets/${decodeURIComponent(originPath)}`;
          resolve(targetURL);
        });
      }
    );
  });
}


