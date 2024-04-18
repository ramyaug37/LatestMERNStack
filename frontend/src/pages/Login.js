import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../services/appApi";

function Login() {
  const my_secret_key = "RAMYA";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isError, isLoading, error }] = useLoginMutation();
  console.log("login", login);
  //   function handleLogin(e) {
  //     e.preventDefault();
  //     login({ email, password });
  //   }

  function handleLogin(e) {
    e.preventDefault();
    login({ email, password }).then((response) => {
      const userId = response.data._id;
      console.log("important", userId);
      generateJwtToken({ _id: userId });

      //   const token = jwt.sign({ _id: userId }, my_secret_key, {
      //     expiresIn: "72h",
      //   });

      //   localStorage.setItem("token", token);
    });
  }

  function generateJwtToken(payload) {
    console.log("important1");
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const jwtExpireIn = "72h";
    const payloadWithExp = {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + jwtExpireIn,
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payloadWithExp));
    console.log("important2");
    const signature = `${encodedHeader}.${encodedPayload}.${my_secret_key}`;
    const encodedSignature = btoa(signature);
    console.log("important3");
    localStorage.setItem(
      "token",
      `${encodedHeader}.${encodedPayload}.${encodedSignature}`
    );
    console.log(
      "xsxsxs",
      `${encodedHeader}.${encodedPayload}.${encodedSignature}`
    );
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="login__form--container">
          <Form style={{ width: "100%" }} onSubmit={handleLogin}>
            <h1>Login to your account</h1>
            {isError && <Alert variant="danger">{error.data}</Alert>}
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Button type="submit" disabled={isLoading}>
                Login
              </Button>
            </Form.Group>

            <p className="pt-3 text-center">
              Don't have an account? <Link to="/signup">Create account</Link>{" "}
            </p>
          </Form>
        </Col>
        <Col md={6} className="login__image--container"></Col>
      </Row>
    </Container>
  );
}

export default Login;
