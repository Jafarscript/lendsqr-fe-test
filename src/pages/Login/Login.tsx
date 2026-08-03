import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authApi';
import LoginIllustration from './LoginIllustration';
import styles from './Login.module.scss';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Email is required.';
    if (!password) errors.password = 'Password is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/users', { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.illustrationPane}>
        <div className={styles.logo}>
          <span className={styles.logoMark} aria-hidden="true" />
          <span>lendsqr</span>
        </div>
        <div className={styles.illustrationWrap}>
          <LoginIllustration />
        </div>
      </div>

      <div className={styles.formPane}>
        <div className={styles.formInner}>
          <h1 className={styles.heading}>Welcome!</h1>
          <p className={styles.subheading}>Enter details to login.</p>

          <form onSubmit={handleSubmit} noValidate>
            {formError && (
              <div className={styles.errorBanner} role="alert">
                {formError}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email" className="visually-hidden">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="username"
                className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <span id="email-error" className={styles.fieldError}>
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className="visually-hidden">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
              {fieldErrors.password && (
                <span id="password-error" className={styles.fieldError}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <a href="#forgot-password" className={styles.forgotPassword}>
              FORGOT PASSWORD?
            </a>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'LOG IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
