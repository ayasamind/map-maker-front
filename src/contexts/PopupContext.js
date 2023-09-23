import { createContext, useState } from "react";
import { defaultPopup } from "@/templates/PopupTemplates";

export const Popup = createContext();

function PopupContext({ children }) {
    const [popup, setPopup] = useState(defaultPopup);
    return (
      <Popup.Provider value={{ popup, setPopup }}>
        {children}
      </Popup.Provider>
    );
}

export default PopupContext;