// import DS from "../assets/DS.svg";
import DS1 from "../assets/DS1.svg";

import { FaArrowRightFromBracket } from "react-icons/fa6";
import { BsHouse } from "react-icons/bs";
import { BsJournalText } from "react-icons/bs";
import { BiAnalyse } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { useContext, useState } from "react";
import { NavMenuContext } from "./NavMenuProvider";

export default function SideBar() {
  const navMenuCtx = useContext(NavMenuContext);
  const [enlarge, setEnlarge] = useState(true);

  function handleEnlarge() {
    setEnlarge((prev) => !prev);
  }

  return (
    <aside className="bg-[#181E34] flex flex-col fixed w-14 h-full left-0 top-0 group md:hover:w-44 md:hover:z-50 transition-all duration-500">
      <div className="w-full mt-4 md:hidden">
        <GiHamburgerMenu
          className="m-auto size-10 p-1 border"
          onClick={navMenuCtx.handleHide}
        />
      </div>
      <div className="bg-[#454B5B] flex justify-center items-center mt-10 h-10 w-full gap-2">
        <div className="bg-[#181E34] size-7 flex justify-center items-center">
          <img src={DS1} alt="DS logo" className="size-5" />
        </div>
        <span className="hidden group-hover:inline text-sm font-bold">
          DataSight
        </span>
        <FaArrowRightFromBracket className="size-4 group-hover:rotate-180" />
      </div>
      <div className="w-full h-14 mt-10 border-t-2 border-white p-4 group-hover:group md:flex md:justify-start md:gap-4">
        <BsHouse className="text-white size-5 " />
        <span className="hidden group-hover:inline md:text-base font-bold">
          Accueil
        </span>
      </div>
      <div className="w-full h-14 border-t-2 border-white p-4 md:flex md:justify-start md:gap-4">
        <BsJournalText className="text-white size-5" />
        <span className="hidden group-hover:inline md:text-base font-bold">
          Historique
        </span>
      </div>
      <div className="w-full h-14 border-y-2 border-white px-4 py-4 md:flex md:justify-start md:items-center md:gap-4">
        <BiAnalyse className="text-white size-7" />
        <span className="hidden group-hover:inline md:text-base font-bold">
          Analyse Rapide
        </span>
      </div>
      <div className="bg-[#323A56] w-full h-11 p-4 absolute bottom-0 left-0 md:flex md:justify-start md:items-center md:gap-4">
        <IoMdHelpCircleOutline className="text-white size-5" />
        <span className="hidden group-hover:inline md:text-base font-bold">
          Centre d'aide
        </span>
      </div>
    </aside>
  );
}
