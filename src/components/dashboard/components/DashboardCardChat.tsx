"use client";
import { useUser } from "@/app/context/UserContext";
import { ApexOptions } from "apexcharts";
import Image from "next/image";
import React from "react";
import ReactApexChart from "react-apexcharts";
const ChartThree: React.FC = () => {
  const user = useUser();

  return (
    <div className="col-span-12 rounded-lg border-[2px] border-black dark:border-white bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-[#181818] dark:bg-black-2 sm:px-7.5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Collaborate with team
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <div className="flex items-start gap-2.5">
            <img
              className="h-8 w-8 rounded-full"
              src={user.photo}
              alt="Jese image"
            />

            <div className="leading-1.5 border-black dark:border-white border-[2px] dark:bg-black-2 flex w-full max-w-[320px] flex-col rounded-e-xl rounded-es-xl bg-white p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-gray-900 text-sm font-semibold dark:text-white">
                  {user.firstName}{" "}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                  11:46
                </span>
              </div>
              <p className="text-gray-900 py-2.5 text-sm font-normal dark:text-white">
                Lets connect in the Messages box.....
              </p>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Delivered
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
