import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../non-components/Header";

const details = {
    name: "",
    address: "",
    mobile: "",
    monthlyRd: 0,
    collectorId: ""
};


function AddUser() {

    let nav = useNavigate();
    const [contact, setContact] = useState({
        name: "",
        address: "",
        mobile: "",
        monthlyRd: 0,
        collectorId: ""
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
        details.name= contact.name;
        details.address=contact.address;
        details.mobile=contact.mobile;
        details.monthlyRd=contact.monthlyRd;
        details.collectorId=localStorage.getItem("collectorId");

        await axios
            .post("http://localhost:2000/collector/newCustomer", details,
            {headers:{'authToken': localStorage.getItem('token')}})
            .then(res => console.log(res.data))
            .catch(err => console.log(err)) 


        const message = document.getElementById("bookAddAlert");
        message.style.visibility = "visible";

        setTimeout(function () {
            setContact(() => {
                return {
                    name: "",
                    address: "",
                    mobile: "",
                    monthlyRd: 0,
                    collectorId: ""
                };
            });
            nav("/collectorPage");
        }, 1000);

    }

    return (
        <div>
            <Header />
            <div className="formContainer">
                <h1>Add New Customer</h1>
                <form className="bookForm" onSubmit={onSubmit}>
                    <div class="input-group mb-3">
                        <span class="input-group-text col-sm-2" >Name</span>
                        <input class="form-control col-sm-5" onChange={update}
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={contact.name} />
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text col-sm-2">Adderss</span>
                        <input class="form-control col-sm-5" onChange={update}
                            name="address"
                            type="text"
                            placeholder="address"
                            value={contact.address} />
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text col-sm-2" >Contact Number</span>
                        <input class="form-control col-sm-5" onChange={update}
                            name="mobile"
                            type="number"
                            placeholder="Contact Number"
                            value={contact.mobile} />
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text col-sm-2" >Monthly RD Amount</span>
                        <input class="form-control col-sm-5" onChange={update}
                            type="number"
                            min="0"
                            name="monthlyRd"
                            placeholder="Monthly RD Amount"
                            value={contact.monthlyRd} />
                    </div>
                    <button type="submit" class="btn btn-secondary"> Submit</button>
                </form>

                <div id="bookAddAlert" class="alert alert-success" role="alert">
                    Customer Added Successfully.
                </div>
            </div>
        </div>
    );
}

export default AddUser;

export { details };