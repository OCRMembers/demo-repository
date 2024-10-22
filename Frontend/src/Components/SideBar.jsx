import DS from "../assets/DS.svg";
import DS1 from "../assets/DS1.svg";

import { FaArrowRightFromBracket } from "react-icons/fa6";
import { BsHouse } from "react-icons/bs";
import { BsJournalText } from "react-icons/bs";
import { BiAnalyse } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { useState } from "react";
import { ImCross } from "react-icons/im";

export default function SideBar() {
    const [hide, setHide] = useState(true);
    function handleHide() {
      setHide((hide) => !hide);
    }
    return (
      <aside className="">
        <div className="h-screen grid grid-cols-[auto_1fr]">
          <div className="bg-[#181E34] flex flex-col fixed w-14 h-full">
            <div className="w-full mt-4">
              <GiHamburgerMenu
                className="m-auto size-10 p-1 border"
                onClick={handleHide}
              />
            </div>
            <div className="bg-[#454B5B] flex justify-center items-center gap-1 mt-10 h-10 w-full">
              <div className="bg-[#181E34] size-7 flex justify-center items-center">
                <img src={DS1} alt="DS logo" className="size-5" />
              </div>
              <FaArrowRightFromBracket className="size-4" />
            </div>
            <div className="w-full mt-10 border-t-2 border-white p-4">
              <BsHouse className="text-white size-5 m-auto" />
            </div>
            <div className="w-full border-t-2 border-white p-4">
              <BsJournalText className="text-white size-5 m-auto" />
            </div>
            <div className="w-full border-y-2 border-white p-4">
              <BiAnalyse className="text-white size-5 m-auto" />
            </div>
            <div className="bg-[#323A56] w-14 p-4 absolute bottom-0 left-0">
              <IoMdHelpCircleOutline className="text-white size-5 m-auto" />
            </div>
          </div>
          <div className={`bg-white w-screen h-full flex flex-col ml-14 ${hide ? "hidden" : ""}`}>
            <div className="flex justify-between items-center m-4 mb-0 text-[#417EE9]">
              <h2 className="text-xl">DataSight</h2>
              <ImCross className="size-6" onClick={handleHide}/>
            </div>
            <div className="m-auto">
              <ul className="flex flex-col justify-center items-center gap-10 text-2xl text-[#417EE9] font-bold">
                <li className="hover:underline">Système OCR</li>
                <li className="hover:underline">A Propos de nous</li>
                <li className="hover:underline">Nous contacter</li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    );
  }