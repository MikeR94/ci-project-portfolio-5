// React and Router
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// API
import axios from "axios";
// Contexts
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
// Notifications
import { NotificationManager } from "react-notifications";
// Components
import { Form, Button, Col, Row, Container } from "react-bootstrap";
// Styles
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
// Utils
import { setTokenTimestamp } from "../../utils/utils";

const SignIn = () => {
  const setCurrentUser = useSetCurrentUser();
  const [errors, setErrors] = useState({});
  const history = useHistory();

  /**
   * Initialize the signInData object
   */
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  /**
   * Destructure signInData
   */
  const { username, password } = signInData;

  /**
   * Function to allow users to edit the input fields
   * and updates the signInData object
   */
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Function to handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      history.push("/home");
      NotificationManager.success(
        "Welcome " + username + ". You are now signed in",
        "Success!"
      );
    } catch (error) {
      setErrors(error.response?.data);
      NotificationManager.error("There was an issue logging you in", "Error");
    }
  };

  return (
    <Container>
      <Row className="mt-5">
        <h1 className={styles.Header}>Sign In</h1>
        <hr></hr>
      </Row>
      <Container className={styles.Container}>
        <Col md={7}>
          <Container className={`${styles.ContentBackground} p-4 `}>
            <h1 className={styles.Header}>Log In</h1>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors?.username?.map((message, idx) => (
                <div key={idx} className={styles.FormError}>
                  {message}
                </div>
              ))}

              <Form.Group controlId="password">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors?.password?.map((message, idx) => (
                <div key={idx} className={styles.FormError}>
                  {message}
                </div>
              ))}
              {errors.non_field_errors?.map((message, idx) => (
                <div key={idx} className={styles.FormError}>
                  {message}
                </div>
              ))}

              <Button className={`mt-4 ${btnStyles.Button}`} type="submit">
                Sign in
              </Button>
            </Form>
          </Container>

          <Container className={`mt-3 ${styles.ContentBackground}`}>
            <Link className={styles.Link} to="/signup">
              Don't have an account with us? <span>Sign up now!</span>
            </Link>
          </Container>
        </Col>
      </Container>
    </Container>
  );
};

export default SignIn;
