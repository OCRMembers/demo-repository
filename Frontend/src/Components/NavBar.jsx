export default function NavBar() {
  return (
    // <nav className="hidden md:max-w-lg h-10 bg-white mt-4 m-auto md:flex md:justify-center md:fixed md:right-0 md:left-0">
    //   <ul className="flex flex-row justify-between items-center gap-10 text-[#417EE9]">
    <nav className="hidden md:block w-full bg-red-500 fixed">
      <ul className="bg-white max-w-lg lg:max-w-3xl h-12 md:h-14 m-auto mt-8 fixed -right-14 left-0 flex justify-around items-center shadow-lg text-[#417EE9] md:text-lg">
        <li>Système OCR</li>
        <li>A propos de nous</li>
        <li>Nous contacter</li>
      </ul>
    </nav>
  );
}
