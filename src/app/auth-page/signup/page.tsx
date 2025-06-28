"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ComponentHeader from "@/components/ComponentHeader/ComponentHeader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createUser } from "@/lib/actions/user.actions";
import {
  CameraIcon,
  LoaderCircle,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import gsap from "gsap";
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const SignUp: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    photo: "",
    userBio: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value, // Ensure the value is treated as a string
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Validate form fields
  const validateForm = useCallback(() => {
    if (
      !user.email ||
      !user.firstName ||
      !user.lastName ||
      !user.password ||
      !user.confirmPassword
    ) {
      return "Please fill in all the fields.";
    }
    if (user.password !== user.confirmPassword) {
      return "Passwords do not match.";
    }
    if (!imageFile) {
      return "Please upload a profile picture.";
    }
    return null;
  }, [user, imageFile]);

  let isSubmitting = false;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    setIsLoading(true);

    const formError = validateForm();
    if (formError) {
      setErrors(formError);
      setIsLoading(false);
      isSubmitting = false;
      return;
    }

    setErrors(null);

    try {
      let base64Image = "";
      if (imageFile) {
        base64Image = await convertImageToBase64(imageFile);
      }

      const newUser = {
        ...user,
        photo: base64Image,
      };

      console.log(newUser);
      const createdUser = await createUser(newUser);
      console.log(createdUser);

      const result = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
      });

      if (result?.error) {
        throw new Error("failed to signin after signup")
      }
      router.push('/')
      router.refresh();

      setUser({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        photo: "",
        userBio: "",
      });
      setImageFile(null);
      setIsLoading(false);


    } catch (error: any) {
      console.error("Error registering user:", error);
      setErrors(error.message);
    } finally {
      isSubmitting = false;
      setIsLoading(false);
    }
  };

  const LogoRef = useRef<HTMLDivElement | null>(null);


  //i dont want fade in fade out animation
  useEffect(() => {

    const el = LogoRef.current;
    gsap.fromTo(el, {
      scale: 0.5,
    }, {
      scale: 1,
      duration: 2,
      ease: "power3.out",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(el, {
      boxShadow: "0 0 0px #00faff",
      filter: "drop-shadow(0 0 20px #00faff)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <DefaultLayout>
      <ComponentHeader pageName="Sign Up" />

      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-black-2">
        <div className="flex flex-wrap items-center" onSubmit={handleSubmit}>
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link href="/">
                <div className="flex flex-col items-center justify-center space-x-2">
                  <div ref={LogoRef} className="ml-2 rounded-full  p-1">
                    <Image
                      width={100}
                      height={100}
                      src={"/images/logo/mainLogo.png"}
                      alt="Logo"
                      priority
                    />
                  </div>
                  <p className="text-8xl font-semibold text-black  dark:text-white">GenMol.ai</p>
                </div>
              </Link>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2"
          >
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign Up to GenMol.ai
              </h2>

              <div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-black-2 dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <UserIcon />
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-black-2 dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <UserIcon />
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-black-2 dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <MailIcon />
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-black-2 dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <LockIcon />
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-black-2 dark:text-white dark:focus:border-primary"
                    />
                    <span className="absolute right-4 top-4">
                      <LockIcon />
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Bio
                  </label>
                  <div className="relative">
                    <textarea
                      name="userBio"
                      value={user.userBio}
                      onChange={handleInputChange}
                      placeholder="Enter your bio"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-black-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Profile Picture
                  </label>
                  <div className="relative flex items-center justify-center">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileInput"
                    />

                    {/* Custom icon for file input */}
                    <div
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                      className="flex cursor-pointer flex-col items-center"
                    >
                      {/* Replace with any icon or image */}
                      <CameraIcon size={25} />
                      <span className="text-gray-500 mt-2 text-sm">
                        Choose Profile Picture
                      </span>
                    </div>
                  </div>
                </div>

                {errors && <div className="mb-4 text-red">{errors}</div>}
                <div className="mb-5">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <LoaderCircle className="mr-2 animate-spin" /> Signing
                        Up...
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Already have an account?{" "}
                    <Link href="/auth-page/signin" className="text-primary">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignUp;
