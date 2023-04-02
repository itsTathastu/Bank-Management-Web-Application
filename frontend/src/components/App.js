import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import React from "react";
import Homepage from "./Homepage";
import Login from "./Login";
import CollectorPage from "./CollectorPage";
import AddUser from "./AddUser";
import AddTransaction from "./AddTransaction";
import CustomerPage from "./CustomerPage";
import CollectorTransactions from "./CollectorTansactions";


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" name="login" element={<Login />} />
                    <Route path="/collectorPage" name="collectorPage" element={<CollectorPage/>} />
                    <Route path="/addUser" name="addUser" element={<AddUser/>} />
                    <Route path="/addTransaction" name="addTransaction" element={<AddTransaction/>} />
                    <Route path="/customerPage" name="customerPage" element={<CustomerPage/>} />
                    <Route path="/collectorTransactions" name="collectorTransactions" element={<CollectorTransactions/>} />

                </Routes>
            </BrowserRouter>

            {/* <Footer/> */}
        </div>

    );
}

export default App;