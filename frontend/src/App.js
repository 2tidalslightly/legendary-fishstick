//Frontend driver

import {BrowserRouter as Router, Navigate, Routes, Route} from "react-router-dom";    //Import routing functions from react-router
import Navigation from "./utilities/navigation";                                            //Import navigation bar function  
import Register from "./webpages/register";                                                 //Import register webpage
import Login from "./webpages/login";                                                       //Import login webpage
import Recommendation from "./webpages/recommendation";                                     //Import recommendation webpage
import Watchlist from "./webpages/watchlist";                                               //Import watchlist webpage

//App layout
function App() {
  return (
    <Router>
      <Navigation>
      </Navigation>
      <Routes>
        <Route path ="/" element={<Navigate to="/login" replace />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </Router>
  );
}

export default App;