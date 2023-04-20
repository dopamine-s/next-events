import { useRef, useState, useEffect, useContext } from 'react';

import NotificationContext from '../../store/notification-context';
import { validateEmail } from '../../helpers/utils';
import classes from './newsletter-registration.module.css';

function NewsletterRegistration() {
  const [emailValidity, setEmailValidity] = useState(null);
  const [signUpMessage, setSignUpMessage] = useState(null);
  const [isSignUpError, setIsSignUpError] = useState(false);
  const emailInputRef = useRef();
  const notificationCtx = useContext(NotificationContext);

  function registrationHandler(event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const isValidEmail = validateEmail(enteredEmail);
    setEmailValidity(isValidEmail);

    if (isValidEmail) {
      notificationCtx.showNotification({
        title: 'Signing up...',
        message: 'Registering for newsletter',
        status: 'pending',
      });

      fetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: enteredEmail }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error(`
              ${response.statusText ?? 'HTTP error'}, status = ${
              response.status
            }`);
          }
          return response.json();
        })
        .then((data) => {
          setSignUpMessage(data.message);
          setTimeout(() => {
            setIsSignUpError(false);
          }, 3000);
          notificationCtx.showNotification({
            title: 'Success!',
            message: 'Successfully signed up for newsletter!',
            status: 'success',
          });
        })
        .catch((error) => {
          console.error(error);
          setIsSignUpError(true);
          setSignUpMessage('Failed to register!');
          setTimeout(() => {
            setIsSignUpError(false);
            setSignUpMessage(null);
          }, 3000);
          notificationCtx.showNotification({
            title: 'Error!',
            message:
              'Failed to register for newsletter. ' + error.message ?? '',
            status: 'error',
          });
        });
    } else {
      setIsSignUpError(true);
      setSignUpMessage('Please enter a valid email!');
      setTimeout(() => {
        setIsSignUpError(false);
        setSignUpMessage(null);
      }, 3000);
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

  const h2Classes = `${isSignUpError ? classes.invalid : ''}`;

  const controlClasses = `${classes.control} ${
    emailValidity === false && classes.invalid
  }`;

  return (
    <section className={classes.newsletter}>
      <h2 className={h2Classes}>
        {signUpMessage ?? 'Sign up to stay updated!'}
      </h2>
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
