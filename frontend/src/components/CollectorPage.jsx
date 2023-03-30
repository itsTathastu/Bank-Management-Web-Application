import React, { useEffect, useState } from "react";
import Header from "../non-components/Header";
import axios from "axios";

function CollectorPage() {

    const id = localStorage.getItem("collectorId");
    const initState = [] ;
    const [customerIdArray, setCustomerIdArray] = useState(initState) ;
    const [customerNameArray, setCustomerNameArray] = useState(initState) ;
    const [collectorData, setCollectorData] = useState(initState) ;
    var arr = [];

    useEffect(() => {
        fetchData();      
    }, []);


    async function fetchData(){
        const wholeData = await axios.get("http://localhost:2000/collector/profile/" + id, 
        {headers:{
        'authToken': localStorage.getItem('token')}});

        wholeData.data.customers.forEach(async ele => {
            const customerNameData = await axios.get("http://localhost:2000/user/profile/" + ele);  
            setCustomerNameArray(prevValue => [...prevValue, customerNameData.data.name]);
        });
        // console.log(customerNameArray);
        setCollectorData(wholeData.data) ;
        setCustomerIdArray(wholeData.data.customers);
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

            
        </div>
    );
}

export default CollectorPage;