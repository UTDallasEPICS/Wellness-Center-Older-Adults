"use client";

import carImage from "../../public/images/croppedCarImage.png";

import React from "react";
import { useAuth } from "../providers/Auth";
import Header from "/app/components/Header.jsx";
import Footer from "/app/components/Footer.jsx";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const { isAuthenticated, handleLogin, handleLogout } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/Dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col h-full w-full bg-[#fbfcf8]">
      <Header />
      <div className="flex flex-row w-[95%] h-[calc(100%-280px)] mx-auto">
        <div className="flex flex-col mt-[10%] ml-[7%] mb-[5%]">
          <h1 className="font-light text-left text-[75px] font-montserrat">
            Driving towards change
          </h1>
          {isAuthenticated ? (
            <>
              <a href="/Dashboard">
                <button className="h-[50px] w-[200px] bg-[#419902] text-white text-[25px] rounded-lg cursor-pointer mt-2">
                  Go Dashboard
                </button>
              </a>
              <button
                className="h-[50px] w-[200px] bg-[#419902] text-white text-[25px] rounded-lg cursor-pointer"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              className="h-[50px] w-[200px] bg-[#419902] text-white text-[25px] rounded-lg cursor-pointer"
              onClick={handleLogin}
            >
              Log In
            </button>
          )}
        </div>

        <Image
          className="w-[50%] mt-[50px]"
          src={carImage}
          alt="Image of car with location icon"
          width={500}
          height={600}
        />
      </div>
      <div className="w-full h-[150px] mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
