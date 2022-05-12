import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import EmailVerification from "../pages/EmailVerification";
import PasswordReset from "../pages/PasswordReset";
import PasswordResetConfirm from "../pages/PasswordResetConfirm";

const BaseRouter = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="" element={<App/>}>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Register/>}/>
                <Route path="/signup/email-confirmation" element={<EmailVerification/>}/>
                <Route path="/account/password-reset" element={<PasswordReset/>}/>
                <Route path="/account/password/reset/confirm/:uid/:token" element={<PasswordResetConfirm/>}/>
                <Route path="" element={<PrivateRoute/>}>
                    <Route path="graduate" element={<main>Página de egresado</main>}>
                        <Route path="information" element={<main>Página de información</main>}/>
                        <Route path="documents" element={<main>Página de documentos</main>}/>
                        <Route path="validation" element={<main>Página de validación</main>}/>
                        <Route path="arp" element={<main>Página de arp</main>}/>
                        <Route path="liberation" element={<main>Página de liberación</main>}/>
                    </Route>
                    <Route path="services" element={<main>Página de egresado</main>}>
                        <Route path="graduates" element={<main>Página de información</main>}/>
                        <Route path="graduates/id" element={<main>Página de documentos</main>}/>
                        <Route path="validation" element={<main>Página de validación</main>}/>
                        <Route path="arp" element={<main>Página de arp</main>}/>
                        <Route path="liberation" element={<main>Página de liberación</main>}/>
                    </Route>
                </Route>
            </Route>
        </Routes>

    </BrowserRouter>
}

export default BaseRouter;