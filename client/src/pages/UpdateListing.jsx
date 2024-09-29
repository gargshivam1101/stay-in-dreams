import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 1,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

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

  const dataChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      // it is the type checkbox
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      // these are just true or false checkboxes
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const submitForm = async (e) => {
    // update
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload atleast an image of the listing");
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError(
          "The discounted price should be lower than the regular price"
        );
      }
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 text-amber-700">
        Update a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={submitForm}>
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
            value={formData.name}
            onChange={dataChange}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Enter Description"
            className="border p-3 rounded-lg bg-amber-50 focus:outline-none text-gray-600"
            required
            value={formData.description}
            onChange={dataChange}
          />
          <input
            type="text"
            id="address"
            placeholder="Enter Address"
            className="border p-3 rounded-lg bg-amber-50 focus:outline-none text-gray-600"
            required
            value={formData.address}
            onChange={dataChange}
          />
          {/* Div for all the checkboxes - start  */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5 bg-red-500 border-red-300 rounded "
                checked={formData.type === "sale"}
                onChange={dataChange}
              />
              <span className="text-amber-800">Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={formData.type === "rent"}
                onChange={dataChange}
              />
              <span className="text-amber-800">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={formData.parking}
                onChange={dataChange}
              />
              <span className="text-amber-800">Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={dataChange}
              />
              <span className="text-amber-800"> Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={formData.offer}
                onChange={dataChange}
              />
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
                value={formData.bedrooms}
                onChange={dataChange}
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
                value={formData.bathrooms}
                onChange={dataChange}
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
                value={formData.regularPrice}
                onChange={dataChange}
              />
              <div className="flex flex-col">
                <p className="text-amber-800">Regular Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs text-amber-900">($ / month)</span>
                )}
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg bg-amber-50 text-gray-600"
                  type="number"
                  id="discountPrice"
                  min="0"
                  required
                  value={formData.discountPrice}
                  onChange={dataChange}
                />
                <div className="flex flex-col">
                  <p className="text-amber-800">Discounted Price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs text-amber-900">($ / month)</span>
                  )}
                </div>
              </div>
            )}
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
          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-70 max-w-72 self-center"
            disabled={loading || uploading}
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-500 mt-5 font-semibold">{error}</p>}
        </div>
      </form>
    </main>
  );
}
