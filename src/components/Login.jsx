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
        <div className="login-container">

            {/* LADO IZQUIERDO */}
            <div className="login-image">
                <div className="overlay">
                    <h1>SafeMemories</h1>
                    <p>Guarda, organiza y comparte tus recuerdos de forma segura</p>
                </div>
            </div>

            {/* LADO DERECHO */}
            <div className="login-form">

                <h2>Iniciar sesión</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={login}>
                    Entrar
                </button>

            </div>

        </div>
    );
}
export default Login;