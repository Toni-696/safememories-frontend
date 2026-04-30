//muestra el formulario de login
//si el login es correcto, muestra un mensaje que diga "Login correcto. Ya puedes iniciar sesión."
//y si no, muestra un mensaje que diga "Error al iniciar sesión"                   

import { useState } from "react";

function Login({ onLogin, setMensaje }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const response = await fetch("http://localhost:8080/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data);
            } else {
                setMensaje(data.error || "Error login");
            }

        } catch {
            setMensaje("Error de conexión");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={login}>Entrar</button>
        </div>
    );
}

export default Login;