import { Alert, Button, Modal, Toast, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  HiOutlineExclamationCircle,
  HiCheck,
  HiExclamation,
  HiX,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MODE = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [mode, setMode] = useState(MODE.VIEW);

  const { t } = useTranslation();

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
          setTimeout(() => {
            setImageFileUploadProgress(null);
          }, 2000);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      setShowToast(true);
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      setShowToast(true);
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        setShowToast(true);
        setMode(MODE.VIEW);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
        setShowToast(true);
        setMode(MODE.VIEW);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
      setShowToast(true);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">
        {t("PROFILE")}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative h-36 w-36 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => mode !== MODE.VIEW && filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder={t("USERNAME")}
          defaultValue={currentUser.username}
          onChange={handleChange}
          readOnly={mode === MODE.VIEW}
          disabled={mode === MODE.VIEW}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          readOnly={mode === MODE.VIEW}
          disabled={mode === MODE.VIEW}
        />
        <TextInput
          type="password"
          id="password"
          placeholder={t("PASSWORD")}
          onChange={handleChange}
          disabled={mode === MODE.VIEW}
          readOnly={mode === MODE.VIEW}
        />
        {mode !== MODE.VIEW && (
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            outline
            disabled={loading || imageFileUploading}
          >
            {t(loading ? "LOADING..." : "UPDATE")}
          </Button>
        )}
      </form>
      {mode === MODE.VIEW && (
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          onClick={() => setMode(MODE.EDIT)}
          className="w-full mt-4"
        >
          {t("EDIT_INFOR_ACCOUNT")}
        </Button>
      )}
      {currentUser.isAdmin && (
        <Link to={"/create-post"}>
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            className="w-full mt-4"
          >
            {t("CREATE_POST")}
          </Button>
        </Link>
      )}
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          {t("DELETE_ACCOUNT")}
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          {t("SIGN_OUT")}
        </span>
      </div>
      {showToast && (
        <Toast className="mt-5">
          {updateUserSuccess ? (
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
          ) : error ? (
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <HiExclamation className="h-5 w-5" />
            </div>
          ) : (
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
              <HiX className="h-5 w-5" />
            </div>
          )}
          <div className="ml-3 text-sm font-normal">
            {updateUserSuccess || error || updateUserError || ""}
          </div>
          <Toast.Toggle onDismiss={() => setShowToast(false)} />
        </Toast>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              {t("DELETE_YOUR_ACCOUNT")}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {t("CONFIRM_YES")}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                {t("CONFIRM_NO")}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
