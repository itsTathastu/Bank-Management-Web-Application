import React, { useEffect, useState } from "react";
import Header from "../non-components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CollectorPage() {

    const nav = useNavigate();

    const id = localStorage.getItem("collectorId");
    const initState = [] ;
    const [customerNameArray, setCustomerNameArray] = useState(initState) ;
    const [collectorData, setCollectorData] = useState(initState) ;

    useEffect(() => {
        fetchData();      
    }, []);

    function transactionRedirect(){
        nav('/collectorTransactions');
    }

    async function fetchData(){
        const wholeData = await axios.get("http://localhost:2000/collector/profile/" + id, 
        {headers:{
        'authToken': localStorage.getItem('token')}});

        wholeData.data.customers.forEach(async ele => {
            const customerNameData = await axios.get("http://localhost:2000/user/profile/" + ele);  
            setCustomerNameArray(prevValue => [...prevValue, customerNameData.data.customerId + " - " + customerNameData.data.name]);
        });
        console.log(customerNameArray);
        setCollectorData(wholeData.data) ;
    }

    return (
        <div>
            <Header />
            <h1>Collector Page</h1>
            <h1>{collectorData.name}</h1>

            {/* Customers associated */}
            <p>
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    Customers
                </button>
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                    {customerNameArray.map(name => (
                        <li>
                            {name}
                        </li>
                    ))}
                </div>
            </div>
            {/* Collector statement */}
            <p>
                <button onClick={transactionRedirect} class="btn btn-primary" type="button"  >
                    Get Statement
                </button>
            </p>
        </div>
    );
}

export default CollectorPage;