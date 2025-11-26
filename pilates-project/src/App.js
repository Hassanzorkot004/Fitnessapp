// import React from 'react';
// import Reda from './reda';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <Reda />
//     </div>
//   );
// }

// export default App;




import React, { useEffect } from 'react'; // ⚠️ ajoute useEffect
import Reda from './reda';
import './App.css';

function App() {
  // ✅ useEffect à l'intérieur du composant
  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then(res => res.json())
      .then(data => console.log(data));
  }, []); // le tableau vide [] signifie "exécuter au montage seulement"

  return (
    <div className="App">
      <Reda />
    </div>
  );
}

export default App;
