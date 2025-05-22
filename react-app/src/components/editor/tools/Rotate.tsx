// // import React, { useState } from 'react';
// import { useImageEditorContext } from '../../../context/ImageEditorContext';

// const RotateTool: React.FC = () => {
//   const { imageState, setImageState } = useImageEditorContext();
//   // const [rotation, setRotation] = useState(imageState.filters.rotation || 0);***********************

//   const applyRotation = () => {
//     setImageState({
//       ...imageState,
//       filters: {
//         ...imageState.filters,
//         // rotation,**********************
//       },
//     });
//   };

//   return (
//     <div>
//       <h3>Rotate Tool</h3>
//       <input
//         type="range"
//         min="0"
//         max="360"
//         value={rotation}
//         onChange={(e) => setRotation(Number(e.target.value))}
//       />
//       <p>Rotation: {rotation}°</p>
//       <button onClick={applyRotation}>Apply</button>
//     </div>
//   );
// };

// export default RotateTool;