// import React, { useEffect, useState } from "react";
// import Alert from "@mui/material/Alert";
// import useAppStore from "../../../store/useStore";


// const LosingAlert = () => {
//   const { currentLoserName, userName } = useAppStore((state) => state);
//   const [showAlert, setShowAlert] = useState(false);

//   const alertStyle = {
//     transition: "opacity 1s ease-in-out", // Smooth fade effect
//     opacity: showAlert ? 1 : 0, // Fully visible initially, fades out later
//   };

//   useEffect(() => {
//     setShowAlert(currentLoserName !== "" && currentLoserName !== userName);
//     const timeout = setTimeout(() => setShowAlert(false), 4000);

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, [currentLoserName]);

//   return (
//     showAlert && (
//       <Alert icon={false} severity="error" style={alertStyle}>
//         {currentLoserName} lost the game
//       </Alert>
//     )
//   );
// };

// export default LosingAlert;
