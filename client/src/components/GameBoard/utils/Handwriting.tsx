import { useEffect } from "react";
import Vara from "vara";

interface HandwrittenTextProps {
  text: string;
}

export function HandwrittenText({ text }: HandwrittenTextProps) {
    useEffect(() => {
      var vara = new Vara(
        "#vara-container",
        "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
        [
          {
            text: text,
            fontSize: 38,
            strokeWidth: 1,
            textAlign: "left",
            x: 20,
            y: 25,
            duration: 2000,
            autoAnimation: true,
          },
        ],
        {
          textAlign: "left"
        }
      );

      return () => {
        const container = document.getElementById("vara-container");
        if (container) {
          container.innerHTML = "";
        }
      };
    }, [text]);
  
    return <div id="vara-container" className="z-[20] w-full h-full"></div>;
}