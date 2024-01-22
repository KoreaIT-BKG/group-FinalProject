
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Test from "./pages/Test";

import Login from "./pages/Login";
import InsertForm from "./pages/InsertForm";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/test" element={<Test/>}/>
      <Route path="/insert" element={<InsertForm/>}/>
      <Route path="/Login" element={<Login/>}/>
    </Routes>
  );
}
