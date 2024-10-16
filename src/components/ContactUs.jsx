import React, { useState } from "react";
import Swal from 'sweetalert2';

const ContactPage = () => {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const sendEmail = async () => {
        const dataSend = { email, subject, message };

        try {
            const res = await fetch(`http://localhost:5000/sendEmail`, {
                method: "POST",
                body: JSON.stringify(dataSend),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Email sent successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setEmail("");
                setSubject("");
                setMessage("");
            } else {
                throw new Error('Failed to send email.');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };

    const handleModalOpen = () => {
        Swal.fire({
            title: 'Welcome to LivFit!',
            text: "We're passionate about helping you achieve your fitness goals. Our platform provides personalized workout plans and community support. Join us on your fitness journey and let's reach new heights together!",
            confirmButtonText: "Let's gooo!",
            background: '#fff',
            color: '#000',
        });
    };

    return (
        <>
            <section className='section' style={{ display: 'flex', justifyContent: 'center' }}>
                <div className='founders-message' onClick={handleModalOpen} style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <h1 className="heading">Founder's Message</h1>
                    <img
                        src={require("../assets/envelope1.jpg")}
                        alt="Envelope"
                        style={{ width: '150px', height: 'auto', margin: '0 auto', borderRadius: '50%' }}
                    />
                </div>
            </section>
            <div className="section">
                <div className="contact-form">
                    <h2>Contact Us</h2>
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="Enter Your Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Subject</label>
                        <input
                            type="text"
                            placeholder="Enter the subject here..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            placeholder="Enter your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button onClick={sendEmail} className="submit-button">Send Email</button>
                </div>
            </div>

        </>
    );
};

export default ContactPage;
