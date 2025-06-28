"use client";
import Breadcrumb from "@/components/ComponentHeader/ComponentHeader";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DarkModeSwitcher from "@/components/Header/DarkModeSwitcher";
import { Edit, MailIcon, CameraIcon, User } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { getUserByEmail, updateUser } from "@/lib/actions/user.actions";

const Settings = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userBio: "",
    photo: "",
    id: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        const user = await getUserByEmail(session.user.email);
        setUserData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userBio: user.userBio || "",
          photo: user.photo || "/images/user/user-03.png",
          id: user._id,
        });
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  const handlePersonalInfoSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userBio: userData.userBio,
        photo: userData.photo,
        email: userData.email,
      };

      if (userData.id) {
        const updated = await updateUser(userData.id, updatedUser);
        setUserData(updated);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors("Failed to update profile.");
      console.error("Error updating user:", error);
    }
  };

  const handleImageUploadSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let base64Image = userData.photo;
      if (imageFile) {
        base64Image = await convertImageToBase64(imageFile);
      }

      if (userData.id) {
        const updatedUser = {
          ...userData,
          photo: base64Image,
        };
        const updated = await updateUser(userData.id, updatedUser);
        setUserData(updated);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors("Failed to upload image.");
      console.error("Error uploading image:", error);
    }
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setUserData((prevData) => ({
        ...prevData,
        photo: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <div className="mb-4 flex flex-row items-center space-x-2 text-black dark:text-white">
          <span>Toggle Theme</span>
          <DarkModeSwitcher />
        </div>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-lg border border-black dark:border-white bg-white dark:bg-black-2">
              <div className="border-b border-black dark:border-white px-7 py-4">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handlePersonalInfoSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        First Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3">
                          <User />
                        </span>
                        <input
                          className="w-full rounded-lg border border-black dark:border-white bg-white dark:bg-black-2 py-3 pl-11.5 pr-4.5 text-black dark:text-white focus:border-primary focus-visible:outline-none"
                          type="text"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Last Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3">
                          <User />
                        </span>
                        <input
                          className="w-full rounded-lg border border-black dark:border-white bg-white dark:bg-black-2 py-3 pl-11.5 pr-4.5 text-black dark:text-white focus:border-primary focus-visible:outline-none"
                          type="text"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-3">
                        <MailIcon />
                      </span>
                      <input
                        className="w-full rounded-lg border border-black dark:border-white bg-white dark:bg-black-2 py-3 pl-11.5 pr-4.5 text-black dark:text-white focus:border-primary focus-visible:outline-none"
                        type="email"
                        name="email"
                        value={userData.email}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      User Bio
                    </label>
                    <textarea
                      className="w-full rounded-lg border border-black dark:border-white bg-white dark:bg-black-2 py-3 pl-4.5 pr-4.5 text-black dark:text-white focus:border-primary focus-visible:outline-none"
                      name="userBio"
                      value={userData.userBio}
                      onChange={handleChange}
                      rows={4}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gray-700 dark:bg-gray-200 py-3 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-lg border border-black dark:border-white bg-white dark:bg-black-2">
              <div className="border-b border-black dark:border-white px-7 py-4">
                <h3 className="font-medium text-black dark:text-white">
                  Profile Picture
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleImageUploadSubmit}>
                  <div className="mb-5.5">
                    <div className="relative h-40 w-40 rounded-full overflow-hidden">
                      {userData.photo ? (
                        <Image
                          src={userData.photo}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <CameraIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profileImage"
                    />
                    <label
                      htmlFor="profileImage"
                      className="w-full rounded-lg border border-black dark:border-white bg-white dark:bg-black-2 py-3 text-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      Upload Profile Picture
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gray-700 dark:bg-gray-200 py-3 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Uploading...' : 'Update Photo'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
