import React, { useState } from "react";
import Header from "../non-components/Header";
import axios from "axios";

function CollectorTransactions() {

    const [statement, setStatement] = useState({
        colId: "",
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
        statement.colId = localStorage.getItem('collectorId')
        const response = await axios.get('http://localhost:2000/collector/statement/' + statement.colId + "&" + statement.startDate + "&" + statement.endDate,
        {headers:{
            'authToken': localStorage.getItem('token')}}
        );

        setEntries(response.data.transaction);
        // console.log(response);

    }

    return (
        <div>
            <Header />
            <h1>Collector transactions</h1>

            <p>
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    Statement
                </button>
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                    <form onSubmit={statementSubmit}>
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
                                    <th>Customer ID</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                                        <td>{entry.customerId}</td>
                                        <td>{entry.transactionAmount}</td>
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

export default CollectorTransactions;