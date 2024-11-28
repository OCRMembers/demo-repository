import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";
import { NavMenuContext } from "../Components/NavMenuProvider";

import { TbUpload } from "react-icons/tb";
import OCRDevices from "../assets/ocr-devices.svg";
import { ImCross } from "react-icons/im";
import fileConversion from "../assets/fileConversion.svg";
import { TfiReload } from "react-icons/tfi";
import { SlEnergy } from "react-icons/sl";
import { createContext, useContext, useRef, useState } from "react";

export default function Home() {
  const [hideNavMenu, setHideNavMenu] = useState(true);

  function handleHide() {
    setHideNavMenu((hide) => !hide);
  }
  const navMenuCtx = {
    hide: hideNavMenu,
    handleHide,
    size: 14,
  };

  let style = {
    width: `calc(100vw - 56px)`,
    position: "relative",
    left: "56px",
  }; //
  return (
    <NavMenuContext.Provider value={navMenuCtx}>
      <section className="flex w-screen">
        <SideBar></SideBar>
        <div className="flex flex-col" style={style}>
          <NavBar></NavBar>
          <NavMenu></NavMenu>
          <Presentation></Presentation>
          <Description></Description>
          {/* <Footer></Footer> */}
        </div>
      </section>
    </NavMenuContext.Provider>
  );
}

function NavMenu() {
  const navMenuCtx = useContext(NavMenuContext);

  return (
    <div
      className={`bg-white h-screen flex flex-col fixed top-0 right-0 transition-transform duration-1000 ease-in-out transform md:hidden ${
        navMenuCtx.hide
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
      style={{
        transitionProperty: "transform, opacity",
        width: "calc(100vw - 56px)",
      }}
    >
      <div className="flex w-full justify-around items-center absolute top-4 gap-10 text-[#417EE9]">
        <h2 className="text-xl">DataSight</h2>
        <ImCross
          className="size-6 cursor-pointer"
          onClick={navMenuCtx.handleHide}
        />
      </div>
      <div className="m-auto">
        <ul className="flex flex-col justify-center items-center gap-10 text-2xl text-[#417EE9] font-bold">
          <li className="hover:underline">Système OCR</li>
          <li className="hover:underline">À Propos de nous</li>
          <li className="hover:underline">Nous contacter</li>
        </ul>
      </div>
    </div>
  );
}

function Presentation() {
  const inputRef = useRef();
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null)
  const [showDownloadButton, setShowDownloadButton] = useState(false)

  function handleButtonClick() {
    inputRef.current.click();
    // console.log(inputRef.current.value);
  }

  function handleChange(event) {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name); // Met à jour le nom du fichier
      setSelectedFile(file); // Stocke le fichier pour l'envoi
    }

  }

  async function handleSubmit() {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier avant de soumettre.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", selectedFile); // Correspondance avec la clé attendue par le backend
  
    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        // Gestion des erreurs HTTP (statut >= 400)
        // console.error("Erreur serveur :", errorData);
        alert(`Erreur serveur : ${response.status} ${response.statusText}`);
        return;
      }
  
      console.log("Fichier envoyé avec succès !");
      setShowDownloadButton((prevValue)=>!prevValue);
    } catch (error) {
      // Gestion des erreurs réseau
      console.error("Erreur réseau :", error);
      alert("Erreur lors de l'envoi du fichier. Vérifiez votre connexion.");
    }
  }

  async function handleDownload() {
    try {
        const response = await fetch('http://127.0.0.1:5000/download', {
            method: 'GET',
        });

        if (!response.ok) {
            alert(`Erreur serveur : ${response.status} ${response.statusText}`);
            return;
        }

        // Conversion de la réponse en Blob
        const blob = await response.blob();

        // Création d'une URL temporaire pour le Blob
        const downloadUrl = window.URL.createObjectURL(blob);

        // Création d'un lien temporaire et déclenchement du téléchargement
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'ascii_grid_output_map.asc'; // Nom du fichier téléchargé
        document.body.appendChild(a);
        a.click();

        // Nettoyage les ressources
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        console.log("Fichier téléchargé avec succès !");
    } catch (error) {
        console.error("Erreur:", error);
        alert("Échec du téléchargement");
    }
}

  return (
    <section className="bg-[#DFF3FF] w-full px-4 md:px-20 md:pt-32 py-8 flex flex-col items-left lg:grid lg:grid-cols-2 lg:justify-items-center lg:justify-center gap-4 lg:gap-0">
      <div className="flex flex-col items-left gap-4">
        <h1 className="max-w-xs md:max-w-sm lg:max-w-lg leading-tight lg:leading-snug text-2xl md:text-3xl lg:text-5xl md:font-bold text-[#282626] uppercase font-montserrat font-medium">
          Tranformez et analysez vos documents via l'ocr
        </h1>
        <p className="text-gray-500 max-w-sm md:max-w-md lg:max-w-lg lg:text-lg">
          Vous disposez de documents papier, de fichiers scannés ou d'images
          contenant du texte, mais vous souhaitez les convertir en contenu
          modifiable et exploitable ? Notre système de reconnaissance optique de
          caractères (OCR) vous permet d'analyser rapidement vos documents pour
          en extraire le texte avec précision.
        </p>
        <div className="flex flex-col items-center md:flex-row gap-3 mt-4">
          <div className="max-w-sm">
            {/* <form action=""> */}
            <input type="file" hidden ref={inputRef} onChange={handleChange} />
            <button
              className="bg-[#1A486B] rounded-sm flex items-center gap-1 p-2 text-base font-normal"
              onClick={handleButtonClick}
            >
              <TbUpload className="size-5" />
              <span className="text-lg">Charger un fichier</span>
            </button>
            {/* </form> */}
          </div>
          {/* <div className="bg-white max-w-48 lg:max-w-lg p-2 border-solid border-gray-200 border-2 hover:border-gray-400"> */}
          <button
            className=" bg-white text-[#666666] text-base lg:text-lg shadow-md"
            onClick={handleSubmit}
          >
            Soumettre
          </button>
          {/* </div> */}
        </div>
        <div className="flex gap-4">
          <span className="text-gray-600">Fichier:</span>
          <span className="text-red-600">{selectedFile?fileName:'Aucun fichier importé'}</span>
        </div>
        {
          showDownloadButton && <div>
          <button className="animate-pulse" onClick={handleDownload}>Télécharger le rendu</button>
        </div>
        }
      </div>
      <div className="flex flex-col justify-center">
        <img
          src={OCRDevices}
          alt=""
          className="size-52 md:size-72 lg:size-96 object-contain m-auto"
        />
      </div>
    </section>
  );
}

// function Description() {
//   return (
//     <section className="bg-[#5674AA]">
//       <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-8 lg:gap-10 px-4 md:px-8 py-8">
//         <div className="bg-white rounded-lg p-4 md:order-2 md:col-span-2 lg:col-start-4 lg:col-span-3 md:flex md:items-center">
//           <p className="uppercase text-[#282626] text-xl md:text-2xl lg:text-3xl text-center font-bold">
//             Pourquoi choisir notre système ?
//           </p>
//         </div>
//         <div className="bg-[#181E34] p-4 flex flex-col gap-2 md:order-1 lg:col-start-2 lg:col-span-2">
//           <div className="flex items-center gap-2">
//             <SlEnergy className="size-6 text-[#FFFF00]" />
//             <h1 className="text-base font-bold italic lg:text-xl">Gagnez en efficacité</h1>
//           </div>
//           <p className="text-sm lg:text-base">
//             Que ce soit pour la numérisation d'archives, la gestion de vos
//             factures, ou pour des projets académiques, l'OCR transforme vos
//             documents en quelques secondes.
//           </p>
//         </div>
//         {/* <div className="md:order-3 md:col-span-2 lg:col-start-2 lg:col-span-3"> */}
//           <img src={fileConversion} alt="" className="md:order-3 md:col-span-2 lg:col-start-2 lg:col-span-3" />
//         {/* </div> */}
//         <div className="bg-[#181E34] p-4 flex flex-col gap-2 md:order-4 lg:col-span-2">
//           <div className="flex items-center gap-3">
//             <TfiReload className="size-6 text-[#4774FD]" />
//             <h1 className="text-base font-bold italic lg:text-xl">
//               Améliorez votre productivité
//             </h1>
//           </div>
//           <p className="text-sm lg:text-base">
//             Extrayez rapidement des informations de grandes quantités de
//             documents sans effort, et accédez à des données modifiables et
//             indexables.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

function Description() {
  return (
    <section className="bg-[#5674AA] w-full py-8 px-4 md:px-8 lg:py-10">
      <div className="flex flex-col md:grid md:grid-cols-[1fr_1fr] lg:grid-cols-7 justify-center items-center gap-10">
        <div className="bg-white md:flex md:items-center max-w-72 md:max-w-none md:h-full rounded-md p-4 md:order-1 lg:col-start-2 lg:col-span-2">
          <p className="uppercase text-[#282626] text-xl md:text-2xl lg:text-3xl text-center font-bold">
            Pourquoi choisir notre système ?
          </p>
        </div>
        <div className="bg-[#181E34] flex flex-col p-4 max-w-72 md:max-w-none md:h-full gap-3 md:order-2 lg:col-start-4 lg:col-span-3">
          <div className="flex items-center gap-2">
            <SlEnergy className="size-6 text-[#FFFF00]" />
            <h1 className="text-base font-bold italic lg:text-xl">
              Gagnez en efficacité
            </h1>
          </div>
          <p className="text-sm lg:text-base">
            Que ce soit pour la numérisation d'archives, la gestion de vos
            factures, ou pour des projets académiques, l'OCR transforme vos
            documents en quelques secondes.
          </p>
        </div>
        <div className="max-w-72 md:max-w-none md:h-full md:order-4 lg:col-start-5 lg:col-span-2">
          <img
            src={fileConversion}
            alt=""
            className="object-contain md:object-cover lg:object-contain size-full"
          />
        </div>
        <div className="bg-[#181E34] flex flex-col gap-3 p-4 max-w-72 md:max-w-none md:h-full md:order-3 lg:col-start-2 lg:col-span-3">
          <div className="flex items-center gap-3">
            <TfiReload className="size-6 text-[#4774FD]" />
            <h1 className="text-base font-bold italic lg:text-xl">
              Améliorez votre productivité
            </h1>
          </div>
          <p className="text-sm lg:text-base">
            Extrayez rapidement des informations de grandes quantités de
            documents sans effort, et accédez à des données modifiables et
            indexables.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="bg-[#181E34]"></footer>;
}
