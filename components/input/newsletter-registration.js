import { useRef, useState, useEffect } from 'react';
import classes from './newsletter-registration.module.css';
import { validateEmail } from '../../helpers/utils';

function NewsletterRegistration() {
  const [emailValidity, setEmailValidity] = useState(null);
  const emailInputRef = useRef();

  function registrationHandler(event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const isValidEmail = validateEmail(enteredEmail);
    setEmailValidity(isValidEmail);

    if (isValidEmail) {
      console.log('pass');

      fetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: enteredEmail }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emailInputRef.current &&
        !emailInputRef.current.contains(event.target)
      ) {
        setEmailValidity(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emailInputRef]);

  function handleInputBlur() {
    setEmailValidity(null);
  }

  const controlClasses = `${classes.control} ${
    emailValidity === false && classes.invalid
  }`;

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={controlClasses}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={emailInputRef}
            onBlur={handleInputBlur}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
