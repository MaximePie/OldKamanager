import Resources from "./components/pages/Resources/Resources";
import Gears from "./components/pages/Gears/Gears";
import Roadmap from "./components/pages/Roadmap/Roadmap";
import Navbar from "./components/molecules/Navbar/Navbar";
import FilterContextProvider from "./contexts/FilterContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shopping from "./components/pages/Shopping/Shopping";
import React from "react";
import Stats from "./components/pages/Stats/Stats";
import { ResourcesProvider } from "./contexts/RessourcesContext";

function App() {
  return (
    <BrowserRouter>
      <FilterContextProvider>
        <ResourcesProvider>
          <div
            style={{
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            <Navbar />
            <div>
              <Routes>
                <Route element={<Resources />} path={"/"} />
                <Route element={<Gears />} path={"/craft"} />
                <Route element={<Shopping />} path={"/shopping"} />
                <Route element={<Roadmap />} path={"/roadmap"} />
                <Route element={<Stats />} path={"/stats"} />
              </Routes>
            </div>
          </div>
        </ResourcesProvider>
      </FilterContextProvider>
    </BrowserRouter>
  );
}

export default App;
