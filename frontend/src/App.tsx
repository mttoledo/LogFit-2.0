import { useState } from "react";

// Components
import Header from "./components/Header";
import WaterModule from "./components/WaterModule";

function App() {
  return (
    <div className="w-full flex flex-col h-screen bg-brand-blue">
      <Header />
      <main className="grid grid-cols-[repeat(2,minmax(0,490px))] gap-4 m-auto max-w-[1000px]">
        <WaterModule />
        <WaterModule />
      </main>
    </div>
  );
}

export default App;
