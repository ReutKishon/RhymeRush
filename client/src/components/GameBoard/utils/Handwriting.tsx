import { useEffect } from "react";
import Vara from "vara";

export function HandwrittenText({ text }: { text: string }) {
    useEffect(() => {
      var vara = new Vara(
        "#vara-container",
        "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
        [
          {
            text: text,
            fontSize: 45,
            strokeWidth: 0.8,
          },
        ]
      );

      return () => {
        const container = document.getElementById("vara-container");
        if (container) {
          container.innerHTML = "";
        }
      };
    }, []);
  
    return <div id="vara-container" className="z-[20] w-full"></div>;
  }