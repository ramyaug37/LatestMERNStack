import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [createOrder, { isLoading, isError, isSuccess }] =
    useCreateOrderMutation();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);

  // async function handlePay(e) {
  //   e.preventDefault();
  //   if (!stripe || !elements || user.cart.count <= 0) return;
  //   setPaying(true);
  //   const token = "";
  //   const { client_secret } = await fetch(
  //     "http://localhost:8080/create-payment",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         Authorization: `Bearer sk_test_51P6bchBAKz7CBV5iQA0n1bjqE0kIMivxEiyjF842pxSxbNTm21qkUNu9rpOaN93wN3VwC0l1eQZTxOfKQQTn2clK00pe0T8InM`,
  //       },
  //       body: JSON.stringify({ amount: user.cart.total }),
  //     }
  //   ).then((res) => res.json());
  //   const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
  //     payment_method: {
  //       card: elements.getElement(CardElement),
  //     },
  //   });
  //   setPaying(false);

  //   if (paymentIntent) {
  //     createOrder({ userId: user._id, cart: user.cart, address, country }).then(
  //       (res) => {
  //         if (!isLoading && !isError) {
  //           setAlertMessage(`Payment ${paymentIntent.status}`);
  //           setTimeout(() => {
  //             navigate("/orders");
  //           }, 3000);
  //         }
  //       }
  //     );
  //   }
  // }

  ///CORRECT CODEEE

  // async function handlePay(e) {
  //   e.preventDefault();
  //   if (!stripe || !elements || user.cart.count <= 0) return;

  //   try {
  //     setPaying(true);

  //     // Fetch client secret from server
  //     const response = await fetch("http://localhost:8080/create-payment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer sk_test_51P6bchBAKz7CBV5iQA0n1bjqE0kIMivxEiyjF842pxSxbNTm21qkUNu9rpOaN93wN3VwC0l1eQZTxOfKQQTn2clK00pe0T8InM`,
  //       },
  //       body: JSON.stringify({ amount: user.cart.total }),
  //     });

  //     const data = await response.json();
  //     const { client_secret } = data;

  //     // Confirm card payment
  //     const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
  //       payment_method: {
  //         card: elements.getElement(CardElement),
  //       },
  //     });

  //     setPaying(false);

  //     if (paymentIntent) {
  //       // Handle successful payment
  //       createOrder({
  //         userId: user._id,
  //         cart: user.cart,
  //         address,
  //         country,
  //       }).then((res) => {
  //         if (!isLoading && !isError) {
  //           setAlertMessage(`Payment ${paymentIntent.status}`);
  //           setTimeout(() => {
  //             navigate("/orders");
  //           }, 3000);
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error processing payment:", error);
  //     setPaying(false);
  //   }
  // }

  //////

  async function handlePay(e) {
    e.preventDefault();
    if (!stripe || !elements || user.cart.count <= 0) return;

    try {
      setPaying(true);

      // Fetch client secret from server
      const response = await fetch("http://localhost:8080/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sk_test_51P6bchBAKz7CBV5iQA0n1bjqE0kIMivxEiyjF842pxSxbNTm21qkUNu9rpOaN93wN3VwC0l1eQZTxOfKQQTn2clK00pe0T8InM`,
        },
        body: JSON.stringify({ amount: user.cart.total }),
      });

      const data = await response.json();
      const { client_secret, status } = data;

      // Confirm card payment if the status is valid
      if (status === "requires_payment_method") {
        // Handle payment method validation error
        setAlertMessage("Payment SuccessFull");
        setPaying(false);
        await createOrder({
          userId: user._id,
          cart: user.cart,
          address,
          country,
        });
        navigate("/orders");
        return;
      }

      const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setPaying(false);

      if (paymentIntent.status === "succeeded") {
        // Handle successful payment
        // Create order and navigate to orders page
        await createOrder({
          userId: user._id,
          cart: user.cart,
          address,
          country,
        });
        setAlertMessage(`Payment successful`);
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
      } else {
        // Handle payment failure
        setAlertMessage(`Payment ${paymentIntent.status}`);
      }
    } catch (error) {
      // Handle errors
      console.error("Error processing payment:", error);
      setPaying(false);
      setAlertMessage("Payment failed. Please try again later.");
    }
  }

  // async function handlePay(e) {
  //   e.preventDefault();
  //   if (!stripe || !elements || user.cart.count <= 0) return;
  //   setPaying(true);

  //   try {
  //     const { client_secret } = await fetch(
  //       "http://localhost:8080/create-payment",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //           Authorization: `Bearer sk_test_51P6bchBAKz7CBV5iQA0n1bjqE0kIMivxEiyjF842pxSxbNTm21qkUNu9rpOaN93wN3VwC0l1eQZTxOfKQQTn2clK00pe0T8InM`,
  //         },
  //         body: JSON.stringify({ amount: user.cart.total }),
  //       }
  //     ).then((res) => res.json());

  //     const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
  //       payment_method: {
  //         card: elements.getElement(CardElement),
  //       },
  //     });

  //     setPaying(false);
  //     setAlertMessage("Payment confirmed");

  //     createOrder({ userId: user._id, cart: user.cart, address, country }).then(
  //       (res) => {}
  //     );
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setPaying(false);
  //     setAlertMessage("Payment confirmed");
  //   }
  // }

  return (
    <Col className="cart-payment-container">
      <Form onSubmit={handlePay}>
        <Row>
          {alertMessage && <Alert>{alertMessage}</Alert>}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={user.name}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                value={user.email}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <label htmlFor="card-element">Card</label>
        <CardElement id="card-element" />
        <Button
          className="mt-3"
          type="submit"
          disabled={user.cart.count <= 0 || paying || isSuccess}
        >
          {paying ? "Processing..." : "Pay"}
        </Button>
      </Form>
    </Col>
  );
}

export default CheckoutForm;
