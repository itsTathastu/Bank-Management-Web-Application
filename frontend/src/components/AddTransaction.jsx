import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../non-components/Header";

const updatedDetails = {
    customerId: "",
    collectorId: "",
    transactionAmount: 0,
    currentCustomerBalance: 0
};

function AddTransaction() {

    let nav = useNavigate();
    const [contact, setContact] = useState({
        customerId: "",
        collectorId: "",
        transactionAmount: 0
    });

    function update(event) {
        const { name, value } = event.target;
        setContact((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            };
        });
    }

    async function onSubmit(event) {
        event.preventDefault();
        updatedDetails.customerId = contact.customerId;
        updatedDetails.transactionAmount = contact.transactionAmount;
        updatedDetails.collectorId = localStorage.getItem("collectorId");

        await axios
            .post("http://localhost:2000/collector/transaction", updatedDetails,
            {headers:{'authToken': localStorage.getItem('token')}})
            .then(res => console.log(res.data))
            .catch(err => console.log(err)) 


        const message = document.getElementById("bookAddAlert");
        message.style.visibility = "visible";

        setTimeout(function () {
            setContact(() => {
                return {
                    customerId: "",
                    collectorId: "",
                    transactionAmount: 0
                };
            });
            nav("/collectorPage");
        }, 1000);

    }

    return (
        <div>
            <Header />
            <div className="formContainer">
                <h1>Add Transaction</h1>
                <form className="bookForm" onSubmit={onSubmit}>
                    <div class="input-group mb-3">
                        <span class="input-group-text col-sm-2" >Customer ID</span>
                        <input class="form-control col-sm-5" onChange={update}
                            type="text"
                            name="customerId"
                            placeholder="Customer ID"
                            value={contact.customerId} />
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text col-sm-2">Amount</span>
                        <input class="form-control col-sm-5" onChange={update}
                            name="transactionAmount"
                            type="number"
                            placeholder="Amount"
                            value={contact.transactionAmount} />
                    </div>
                    <button type="submit" class="btn btn-secondary"> Submit</button>
                </form>

                <div id="bookAddAlert" class="alert alert-success" role="alert">
                    Transaction Successful
                </div>
            </div>
        </div>
    );
}

export default AddTransaction;

export { updatedDetails };