import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  console.log(formData);

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("Uploading");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const uploadImages = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        // make promises one by one for each file
        promises.push(uploadImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Image upload failed (each image should be max 2 MB"
          );
          setUploading(false);
        });
    } else {
      setImageUploadError("Image upload failed (max 6 images per listing)");
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index), // filter if index not same
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 text-amber-700">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        {/* Div for the left column - start */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            className="border p-3 rounded-lg bg-amber-50 focus:outline-none text-gray-600"
            minLength="10"
            maxLength="62"
            required
          />
          <textarea
            type="text"
            id="description"
            placeholder="Enter Description"
            className="border p-3 rounded-lg bg-amber-50 focus:outline-none text-gray-600"
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Enter Address"
            className="border p-3 rounded-lg bg-amber-50 focus:outline-none text-gray-600"
            required
          />
          {/* Div for all the checkboxes - start  */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5 bg-red-500 border-red-300 rounded "
              />
              <span className="text-amber-800">Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span className="text-amber-800">Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span className="text-amber-800">Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span className="text-amber-800"> Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span className="text-amber-800">Offer Available ?</span>
            </div>
          </div>
          {/* Div for all the checkboxes - end */}
          {/* Div for all the integer values - start */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-amber-50 text-gray-600"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
              />
              <p className="text-amber-800">Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-amber-50 text-gray-600"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
              />
              <p className="text-amber-800">Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-amber-50 text-gray-600"
                type="number"
                id="regularPrice"
                min="1"
                required
              />
              <div className="flex flex-col">
                <p className="text-amber-800">Regular Price</p>
                <span className="text-xs text-amber-900">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg bg-amber-50 text-gray-600"
                type="number"
                id="discountPrice"
                min="1"
                required
              />
              <div className="flex flex-col">
                <p className="text-amber-800">Discounted Price</p>
                <span className="text-xs text-amber-900">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        {/* Div for the right column - start */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-amber-700">
            Images:
            <span className="font-norma ml-2 text-amber-950">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-700 rounded w-full shadow-md"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              disabled={uploading}
              className="p-3 bg-green-700 text-white border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              type="button"
              onClick={uploadImages}
            >
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-500 mt-5 font-semibold">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border border-gray-700 items-center shadow-md"
              >
                <img
                  src={url}
                  alt="images"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  className="p-3 text-red-700 uppercase rounded-lg hover:opacity-75"
                  onClick={() => removeImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-70 max-w-72 self-center">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
