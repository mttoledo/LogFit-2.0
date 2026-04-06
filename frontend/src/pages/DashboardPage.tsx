import React from "react";
import Header from "../components/Header";
import WaterModule from "../components/WaterModule";

const DashboardPage = () => {
  return (
    <div className="w-full flex flex-col h-screen bg-brand-blue">
      <Header />
      <main className="grid grid-cols-[repeat(2,minmax(0,490px))] gap-4 m-auto max-w-250">
        <WaterModule />
        <WaterModule />
      </main>
    </div>
  );
};

export default DashboardPage;
