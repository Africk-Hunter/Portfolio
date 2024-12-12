import React, { useState } from 'react';
import emailjs from 'emailjs-com';
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

    emailjs.sendForm('service_cxyb1s5', 'template_oylvcbn', e.target, 'CBZDxMNtzcxxOowCO')
      .then((result) => {
        console.log(result.text);
        setSubmitted(true);
      }, (error) => {
        console.log(error.text);
        alert('Error: ' + error.text);
      });
  };

  return (
    <section id="Contact" className="contact">
      <section className="contactTaglinesWrapper">
        <h2 className="contactTagline">Want to get in touch?</h2>
        <h1 className="contactSecondaryTagline">You can contact me directly at <a className="underlined" id="myEmailAddress" href='mailto:HunterAfrick@Gmail.com'>HunterAfrick@gmail.com</a> or through this form</h1>
      </section>

      <section className="emailOptionsWrapper">
        {submitted ? (
          <p className='thankYouText'>Thanks for your message! I'll get back to you soon.</p>
        ) : (
          <form className='emailOptionsWrapper' onSubmit={handleSubmit}>
            <FormField id='name' elementName='name' placeholderText='Your Name' elementValue={formData.name} onChangeFunc={handleChange} />
            <FormField id='email' elementName='email' placeholderText='Your Email Address' elementValue={formData.email} onChangeFunc={handleChange} elementType="email" />
            <FormField id='message' elementName='message' placeholderText='Your Message' elementValue={formData.message} onChangeFunc={handleChange} />

            <div className="buttonWrapper">
              <button className="messageSubmitButton" type="submit">Submit <img className="submitImg" src={plane} alt="" /></button>
            </div>
          </form>
        )}
      </section>
    </section>
  );
};

const FormField = ({ id, elementName, placeholderText, elementValue, onChangeFunc, elementType = 'text' }) => {
  const isMessageField = (id === 'message');

  return (
    <>
      {isMessageField ? (
        <div className='userMessageContainer'>
          <textarea className='formInput' id={id} name={elementName} placeholder={placeholderText} value={elementValue} onChange={onChangeFunc} required />
        </div>
      ) : (
        <div className='userEmailContainer'>
          <input className='formInput' id={id} name={elementName} placeholder={placeholderText} value={elementValue} onChange={onChangeFunc} type={elementType} required />
        </div>
      )}
    </>
  );
};

export default Contact;
