// 'use client'
// import React, { useState } from "react";
// import colorNameList from "../../data/colornames.json";



// function ColorNameFinder() {
//   const [colorCode, setColorCode] = useState("");

//   const getColorName = (hex: string) => {
//     const match = colorNameList.find(
//       (color) => color.hex.toLowerCase() === hex.toLowerCase()
//     );
//     return match ? match.name : "Unknown color";
//   };
//   console.log(colorNameList); // Verify what is being imported
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Color Name Finder</h1>
//       <input
//         type="text"
//         value={colorCode}
//         onChange={(e) => setColorCode(e.target.value)}
//         placeholder="Enter Hex Color Code"
//         style={{ marginRight: "10px" }}
//       />
//       <p style={{ marginTop: "20px" }}>
//         <strong>Color Name:</strong> {getColorName(colorCode)}
//       </p>
//     </div>
//   );
// }

// export default ColorNameFinder;
