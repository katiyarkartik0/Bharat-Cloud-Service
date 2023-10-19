import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css"
import AuthenticationPage from "pages/auth/authenticationPage";
import UnauthorizedPage from "pages/unauthorizedPage/UnauthorizedPage";
// import HomePage from "pages/homepage/homepage";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthenticationPage />}></Route>
        {/* <Route path="/todo" element={<HomePage/>}></Route> */}
        <Route path="*" element={<UnauthorizedPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
