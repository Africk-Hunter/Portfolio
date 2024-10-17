import React, { useState } from 'react';
import plane from '../images/planeIcon.svg';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
    .then(() => setSubmitted(true))
    .catch((error) => alert('Error: ' + error));
  };

  return (
    <section id="Contact" className="contact">
      <section className="contactTaglinesWrapper">
        <h2 className="contactTagline">Want to get in touch?</h2>
        <h1 className="contactSecondaryTagline">You can contact me directly at <a className="underlined" id="myEmailAddress" href='mailto:HunterAfrick@Gmail.com'>HunterAfrick@gmail.com</a> or through this form</h1>
      </section>

      <section className="emailOptionsWrapper">
        {submitted ? (
          <p>Thanks for your message! I'll get back to you soon.</p>
        ) : (
          <form className='emailOptionsWrapper' onSubmit={handleSubmit} name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="bot-field" />

            <div className="userEmailContainer">
              <input className="emailInput" name="name" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="userEmailContainer">
              <input className="emailInput" name="email" id="email" placeholder="Your Email Address" value={formData.email} onChange={handleChange} required type="email" />
            </div>

            <div className="userMessageContainer">
              <textarea className="messageInput" name="message" id="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
            </div>

            <div className="buttonWrapper">
              <button className="messageSubmitButton" type="submit">Submit <img className="submitImg" src={plane} alt="" /></button>
            </div>
          </form>
        )}
      </section>
    </section>
  );
};

export default Contact;
