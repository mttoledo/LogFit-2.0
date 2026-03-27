import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import WaterModule from "./components/WaterModule";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>

    // <div className="w-full flex flex-col h-screen bg-brand-blue">
    //   <Header />
    //   <main className="grid grid-cols-[repeat(2,minmax(0,490px))] gap-4 m-auto max-w-[1000px]">
    //     <WaterModule />
    //     <WaterModule />
    //   </main>
    // </div>
  );
}

export default App;
