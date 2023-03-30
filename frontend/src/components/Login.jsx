import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../non-components/Header.jsx";

function Login(props) {

    const nav = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setUser(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }

    async function handleSubmit(e) {

        e.preventDefault();
        const response = await fetch("http://localhost:2000/collector/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: user.email, password: user.password })
        });
        const json = await response.json()
        // console.log(json);
        const loggedCollector = json.collector;
        // console.log(loggedCollector.collectorId);
        if (json.check) {
            // Save the auth token and redirect
            localStorage.setItem("token", json.authToken);
            localStorage.setItem("collectorId", loggedCollector.collectorId);
            const message = document.getElementById("Alert1");
            message.style.visibility = "visible";

            setTimeout(function () {
                nav("/collectorPage");
            }, 1000);

        }
        else {
            const message = document.getElementById("Alert2");
            message.style.visibility = "visible";

            setUser({
                email: "",
                password: ""
            })

            setTimeout(function () {
                message.style.visibility = "hidden";
            }, 1000);
        }
    }

    return (
        <div>
            <Header />
            <div className="formContainer">
                <form className="bookForm" onSubmit={handleSubmit}>
                    <div className="LoginInput">
                        <div class="input-group mb-3">
                            <span class="input-group-text col-sm-2" >E-mail</span>
                            <input class="form-control col-sm-5" onChange={handleChange}
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                value={user.email} />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text col-sm-2" >Password</span>
                            <input class="form-control col-sm-5" onChange={handleChange}
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                value={user.password} />
                        </div>
                    </div>

                    <button class="btn btn-secondary" type="submit"> Log in</button>
                </form>

                <div id="Alert1" class="alert alert-success" role="alert">
                    Logged In Successfully.
                </div>
                <div id="Alert2" class="alert alert-danger" role="alert">
                    Unsuccessful Log In.
                </div>
            </div>
        </div>
    );
}

export default Login;