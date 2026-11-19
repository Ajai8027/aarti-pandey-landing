import { useEffect, useRef, useState } from 'react';
import styles from '../styles/RegistrationForm.module.css';

const EMPTY_VALUES = { fullName: '', email: '', organization: '', interest: '' };
const INTERESTS = ['Strategy', 'Operations', 'Team Enablement'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Required fields plus a well-formed email address. Returns a field-keyed error map. */
function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Enter your full name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Enter your work email.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address, for example name@company.com.';
  }

  if (!values.organization.trim()) {
    errors.organization = 'Enter your organization.';
  }

  return errors;
}

/**
 * Accessible briefing registration form. All state stays in this browser session:
 * nothing is fetched, stored, or sent to a server.
 */
export default function RegistrationForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fieldRefs = useRef({});
  const statusRef = useRef(null);

  useEffect(() => {
    if (submitted) statusRef.current?.focus();
  }, [submitted]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);

    // Clear a field's error as soon as the user corrects it.
    if (errors[name]) {
      setErrors((current) => {
        const updated = { ...current };
        const message = validate(next)[name];
        if (message) updated[name] = message;
        else delete updated[name];
        return updated;
      });
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setErrors((current) => {
      const updated = { ...current };
      const message = validate(values)[name];
      if (message) updated[name] = message;
      else delete updated[name];
      return updated;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
    setSubmitted(false);
    requestAnimationFrame(() => fieldRefs.current.fullName?.focus());
  };

  const field = (name, label, type, autoComplete) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label} <span className={styles.required} aria-hidden="true">*</span>
      </label>
      <input
        className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        ref={(element) => {
          fieldRefs.current[name] = element;
        }}
        aria-invalid={errors[name] ? 'true' : undefined}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <p className={styles.error} id={`${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section id="register" data-testid="register" className={styles.register} aria-labelledby="register-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="register-title">Join the Business Growth Briefing</h2>
          <p>A practical session on clearer priorities and smoother workflows.</p>
        </header>

        <div className={styles.card}>
          {submitted ? (
            <div className={styles.success} data-testid="success-status" role="status" aria-live="polite" tabIndex={-1} ref={statusRef}>
              <h3>Request recorded</h3>
              <p>Thank you. Your request has been recorded in this browser session.</p>
              <button className={styles.resetButton} type="button" onClick={handleReset}>
                Send another request
              </button>
            </div>
          ) : (
            <form noValidate data-testid="registration-form" onSubmit={handleSubmit}>
              <p className={styles.requiredNote}>Fields marked * are required.</p>
              <div className={styles.grid}>
                {field('fullName', 'Full name', 'text', 'name')}
                {field('email', 'Work email', 'email', 'email')}
                {field('organization', 'Organization', 'text', 'organization')}

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="interest">
                    Area of interest <span className={styles.optional}>(optional)</span>
                  </label>
                  <select
                    className={styles.input}
                    id="interest"
                    name="interest"
                    value={values.interest}
                    onChange={handleChange}
                    ref={(element) => {
                      fieldRefs.current.interest = element;
                    }}
                  >
                    <option value="">Select an area</option>
                    {INTERESTS.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                </div>

                <button className={styles.submit} type="submit">
                  Request a place
                </button>
              </div>
            </form>
          )}
        </div>

        <p className={styles.privacy}>
          Form submissions are handled locally for this frontend assignment; no live inbox or server integration is
          required.
        </p>
      </div>
    </section>
  );
}
