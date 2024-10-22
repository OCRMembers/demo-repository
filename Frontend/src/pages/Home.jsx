import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";

import { TbUpload } from "react-icons/tb";
import OCRDevices from "../assets/ocr-devices.svg";
import fileConversion from "../assets/fileConversion.svg";
import { TfiReload } from "react-icons/tfi";
import { SlEnergy } from "react-icons/sl";

export default function Home() {
  return (
    <section className="flex w-screen">
      <SideBar></SideBar>
      <div className="flex flex-col w-full ml-14">
        <NavBar></NavBar>
        <Presentation></Presentation>
        <Description></Description>
        <Footer></Footer>
      </div>
    </section>
  );
}

function Presentation() {
  return (
    <section className="bg-[#DFF3FF] w-full px-4 md:px-20 md:pt-32 py-8 flex flex-col items-left gap-4">
      <h1 className="max-w-xs md:order-1 md:max-w-sm leading-tight text-2xl md:text-3xl md:font-bold text-[#282626] uppercase font-montserrat font-medium">
        Tranformez et analysez vos documents via l'ocr
      </h1>
      <p className="text-gray-500 md:order-2 max-w-sm md:max-w-md">
        Vous disposez de documents papier, de fichiers scannés ou d'images
        contenant du texte, mais vous souhaitez les convertir en contenu
        modifiable et exploitable ? Notre système de reconnaissance optique de
        caractères (OCR) vous permet d'analyser rapidement vos documents pour en
        extraire le texte avec précision.
      </p>
      <div className="flex flex-col justify-center md:order-4">
        <img
          src={OCRDevices}
          alt=""
          className="size-52 md:size-72 object-contain m-auto"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-3 mt-4 md:order-3">
        <div className="max-w-sm">
          <button className="bg-[#1A486B] rounded-sm flex items-center gap-1 p-2 text-base font-normal">
            <TbUpload className="size-5" />
            <span>Charger un fichier</span>
          </button>
        </div>
        <div className="bg-white max-w-48 p-2 border-solid border-gray-200 border-2 hover:border-gray-400">
          <input
            type="text"
            className=" bg-white text-[#666666] text-base font-normal focus:outline-none"
            placeholder="Entrez l'URL du fichier"
          />
        </div>
      </div>
    </section>
  );
}

function Description() {
  return (
    <section className="bg-[#5674AA] flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8 px-4 md:px-8 py-8">
      <div className="bg-white rounded-sm p-4 md:order-2 md:col-span-2 md:flex md:items-center">
        <p className="uppercase text-[#282626] md:text-2xl text-center m-auto text-xl font-bold">
          Pourquoi choisir notre système ?
        </p>
      </div>
      <div className="bg-[#181E34] p-4 flex flex-col gap-2 md:order-1">
        <div className="flex items-center gap-2">
          <SlEnergy className="size-6 text-[#FFFF00]"/>
          <h1 className="text-base font-bold italic">Gagnez en efficacité</h1>
        </div>
        <p className="text-sm">
          Que ce soit pour la numérisation d'archives, la gestion de vos
          factures, ou pour des projets académiques, l'OCR transforme vos
          documents en quelques secondes.
        </p>
      </div>
      <div className="md:order-3 md:col-span-2">
        <img src={fileConversion} alt="" className="size-full"/>
      </div>
      <div className="bg-[#181E34] p-4 flex flex-col gap-2 md:order-4">
        <div className="flex items-center gap-3">
          <TfiReload className="size-6 text-[#4774FD]"/>
          <h1 className="text-base font-bold italic">Améliorez votre productivité</h1>
        </div>
        <p className="text-sm">
        Extrayez rapidement des informations de grandes quantités de documents sans effort, et accédez à des données modifiables et indexables.
        </p>
      </div>
    </section>
  );
}

function Footer(){
  return <footer className="bg-[#181E34]">

  </footer>
}