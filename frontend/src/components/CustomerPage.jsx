import React, { useEffect, useState } from "react";
import Header from "../non-components/Header";
import axios from "axios";

function CustomerPage() {

    const [statement, setStatement] = useState({
        custId: "",
        startDate: "",
        endDate: ""
    });

    const [entries, setEntries] = useState({});

    function handleChangeStatement(event) {
        const { name, value } = event.target;

        setStatement(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }


    async function statementSubmit(e) {
        e.preventDefault();

        const response = await axios.get('http://localhost:2000/user/statement/' + statement.custId + "&" + statement.startDate + "&" + statement.endDate);

        setEntries(response.data.transaction);

    }


    return (
        <div>
            <Header />
            <h1>Customer Page</h1>

            <p>
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    Statement
                </button>
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                    <form onSubmit={statementSubmit}>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Customer ID</label>
                            <input onChange={handleChangeStatement} name="custId" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="CUST***" />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Start Date</label>
                            <input onChange={handleChangeStatement} name="startDate" type="date" class="form-control" id="exampleInputDate1" placeholder="" />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">End Date</label>
                            <input onChange={handleChangeStatement} name="endDate" type="date" class="form-control" id="exampleInputDate1" placeholder="" />
                        </div>
                        <button type="submit" class="btn btn-primary">Get Statement </button>
                    </form>
                </div>
                <div class="card card-body">
                    {Array.isArray(entries) && entries.length ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Collector ID</th>
                                    <th>Amount</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                                        <td>{entry.collectorId}</td>
                                        <td>{entry.transactionAmount}</td>
                                        <td>{entry.currentCustomerBalance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No entries</div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default CustomerPage;