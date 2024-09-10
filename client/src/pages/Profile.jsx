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

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  console.log(filePercentage);

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
    </div>
  );
}
