
const { getStorage, ref, uploadBytesResumable, getDownloadURL,deleteObject} = require('firebase/storage');
const { signInWithEmailAndPassword} = require("firebase/auth");
const { auth } = require('../config/firebase.config');


const uploadImage = async (req, res, next) => {
    try {
        const storageFB = getStorage();
         files = req.files.map(file => ({
            mimetype: file.mimetype,
            buffer: file.buffer
        }));

        await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);

        const imageUrls = [];
        const imagesId =[]
        for (const file of files) {
            const dateTime = Date.now();
            const fileName = `images/${dateTime}`;
            const storageRef = ref(storageFB, fileName);
            const metadata = {
                contentType: file.mimetype,
            };

            await uploadBytesResumable(storageRef, file.buffer, metadata);
            const downloadURL = await getDownloadURL(ref(storageFB, fileName));
            imageUrls.push(downloadURL);
            //Removes the last element from an array and returns  pop
            // const imageName = fileName.split('/').pop();
            imagesId.push(fileName);
        }
        // req.imagesId = imagesId;
        req.body.images = imageUrls;
        next();

    } catch (err) {
        console.log("Error happened", err.message);
        res.status(500).json({
            status: "failed",
            message: err.message
        });
    }
};

const deleteImages = async (images) => {
    try {
      const storageFB = getStorage();
      await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);
     images.map(async (image) => {
        const storageRef = ref(storageFB, image);
        await deleteObject(storageRef);
      });
    } catch (err) {
      console.log("error in deleted Image from firebase",err.message);
    }
  };
module.exports={
    uploadImage,
    deleteImages
}