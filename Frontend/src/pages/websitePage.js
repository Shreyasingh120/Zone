import React from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import "./websitePage.css";

const WebsitePage = () => {
    return (
        <div className="website-page">
            <Navbar />
            <div className="main-content-website">
                <div className="content-section-website">
                    <div className="dynamic-text">Zone</div>
                    <div className="content">
                        <div className="paragraph">
                            <p>
                                <span className="highlighted">Welcome</span> to Zone, your ultimate cloud storage solution designed to meet modern needs. Our platform offers seamless and secure storage for all your files, whether you're handling personal documents, collaborating on team projects, or sharing large media files. Zone ensures efficient performance and top-notch security, making it easy to manage your files with confidence. With a user-friendly interface, navigating and organizing your storage has never been simpler. Experience the convenience of Zone and take control of your digital world.
                            </p>
                        </div>
                        <div className="highlights">
                            <h2>Key features include:</h2><br></br>
                            <div className="highlight-item">Real-time synchronization across devices</div>
                            <div className="highlight-item">Advanced search functionalities</div>
                            <div className="highlight-item">Customizable access controls</div>
                            <div className="highlight-item">Robust encryption for data protection</div>
                            <div className="highlight-item">Efficient file sharing and collaboration tools</div>
                            <div className="highlight-item">Seamless integration with other platforms</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default WebsitePage;
