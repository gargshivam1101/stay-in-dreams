import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutUserStart,
  logoutUserFailure,
  logoutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingError, setListingError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // calculate percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  const handleValChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const deleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const logoutUser = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch("api/auth/logout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(logoutUserFailure(data.message));
        return;
      }
      dispatch(logoutUserSuccess(data));
    } catch (error) {
      dispatch(logoutUserFailure(error.message));
    }
  };

  const showListings = async () => {
    try {
      setListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      } else if (data.length === 0) {
        setListingError(true);
      }

      setUserListings(data);
    } catch (error) {
      setListingError(true);
    }
  };

  const deleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      // update userListing if success
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 text-amber-700 mb-10">
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={submitForm}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile pic"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center"
          onClick={() => fileRef.current.click()}
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-red-500">
              Error while uploading image! (File size should be less than 2 MB)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-amber-700">
              {`Uploading Progress: ${filePercentage}%`}
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-500">Success</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="Update Username"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
          defaultValue={currentUser.username}
          onChange={handleValChange}
        />
        <input
          type="text"
          id="email"
          placeholder="Update Email"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
          defaultValue={currentUser.email}
          onChange={handleValChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Update Password"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
        />
        <button
          disabled={loading}
          className="bg-amber-700 text-white p-3 px-10 rounded-lg uppercase hover:opacity-95 disabled:opacity-70 max-w-72 self-center"
        >
          {loading ? "Loading" : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 disabled:opacity-70 max-w-72 self-center"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-amber-700 cursor-pointer" onClick={deleteUser}>
          Delete account
        </span>
        <span className="text-amber-700 cursor-pointer" onClick={logoutUser}>
          Logout
        </span>
      </div>
      {error && <p className="text-red-500 mt-5 font-semibold">{error}</p>}
      {updateSuccess && (
        <p className="text-green-600 mt-5 font-semibold">
          User updated successfully!
        </p>
      )}
      <button className="text-green-700 w-full" onClick={showListings}>
        Show Listings
      </button>
      {listingError && (
        <p className="text-red-500 mt-5 font-semibold text-center">
          Error fetching listings, or there are none yet
        </p>
      )}

      {/* Show Listings below */}
      {userListings && userListings.length > 0 && (
        <div>
          <h1 className="text-center mt-6 text-2xl text-amber-700 font-semibold gap-4">
            Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center m-2 gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing image"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  className="text-red-700 uppercase rounded-lg hover:opacity-75"
                  onClick={() => deleteListing(listing._id)}
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-amber-600 uppercase rounded-lg hover:opacity-75">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
