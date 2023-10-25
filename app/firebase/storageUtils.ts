import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

export const uploadProfileImage = async (userId: string, imageFile: File) => {
  const imageRef = ref(storage, `profileImages/${userId}`);

  const uploadTask = uploadBytesResumable(imageRef, imageFile);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
