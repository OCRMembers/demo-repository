import { createContext } from "react";

export const NavMenuContext = createContext({
    hide:true,
    size:'',
    handleHide: ()=> {}
})

// function handleHide() {
//     setHide((hide) => !hide);
// }

export default function NavMenuProvider(){

}