import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from "./src/pages/loginPage";
import SignupPage from "./src/pages/signupPage";
import HomePage from "./src/pages/homePage";
import OtpPage from "./src/pages/otpPage";
import WebsitePage from "./src/pages/websitePage";
import { useSelector } from "react-redux";
import AboutUsPage from "./src/components/AboutUs/index.js";
import ContactUs from "./src/components/ContactUs/index.js";

const AppRouter = () => {
    const { isAuthorized, isEmailVerified } = useSelector((e) => e.auth);
    // const isAuthorized=true;
    // const isEmailVerified=true
    console.log(isEmailVerified);

    const router = createBrowserRouter([
        {
            path: "/Storify",
            element: isAuthorized ? <>{
                isEmailVerified ? <HomePage /> : <Navigate to="/otp" />
            }</>
                : <Navigate to="/" />,
        },
        {
            path: "/",
            element: isAuthorized ? <Navigate to="/storify" /> : <WebsitePage />,
        },
        {
            path: "/login",
            element: isAuthorized ? <Navigate to="/storify" /> : <LoginPage />,
        },
        {
            path: "/signup",
            element: isAuthorized ? <Navigate to="/storify" /> : <SignupPage />,
        },
        {
            path: "/otp",
            element: isAuthorized && !isEmailVerified ? <OtpPage /> : <Navigate to="/storify" />,
        },
        {
            path: "/aboutus",
            element: <AboutUsPage />,
        },
        {
            path: "/contactus",
            element: <ContactUs />,
        },



    ]);
    return <RouterProvider router={router} />

};

export default AppRouter;