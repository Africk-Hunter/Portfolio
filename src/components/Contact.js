import React from 'react';
import plane from '../images/planeIcon.svg';

const Contact = () => {
  return (
    <section id="Contact" className="contact">
        <section className='contactTaglinesWrapper'>
            <h2 className='contactTagline'>Want to get in touch?</h2>
            <h1 className='contactSecondaryTagline'>You can contact me directly at <span class="underlined" id='myEmailAddress'>HunterAfrick@gmail.com</span> or through this form</h1>
        </section>

        <section className='emailOptionsWrapper'>
            <div className='userEmailContainer'>
                <input className='emailInput' placeholder='Your Name' id='nameInput'></input>
            </div>
            <div className='userEmailContainer'>
                <input className='emailInput' placeholder='Your Email Address' id='emailInput'></input>
            </div>
            <div className='userMessageContainer'>
                <textarea className='messageInput' placeholder='Your Message' id='messageInput'></textarea>
            </div>
            <div className='buttonWrapper'>
                <button className='messageSubmitButton'>Submit<img className='submitImg' src={plane} alt=''></img></button>
            </div>
        </section>
    </section>
  );
};

export default Contact;
