import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>About GURU.Ik</h5>
            <p className="text-white">
              A community knowledge sharing platform for inclusive education in
              Sri Lanka. Bridging the gap between learners and educators across
              the country.
            </p>
            <div className="social-icons">
              <a href="#" className="text-white me-2">
                <FaFacebook />
              </a>
              <a href="#" className="text-white me-2">
                <FaTwitter />
              </a>
              <a href="#" className="text-white me-2">
                <FaInstagram />
              </a>
              <a href="#" className="text-white me-2">
                <FaYoutube />
              </a>
              <a href="#" className="text-white">
                <FaGithub />
              </a>
            </div>
          </Col>

          <Col md={2} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/lessons" className="text-white">
                  Lessons
                </a>
              </li>
              <li>
                <a href="/qna" className="text-white">
                  Q&A Forum
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3} className="mb-4 mb-md-0">
            <h5>Content Categories</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  Mathematics
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  Science
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  Languages
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  History
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  Technology
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Contact Us</h5>
            <address className="text-white">
              <strong>University of Sri Jayewardenepura</strong>
              <br />
              Faculty of Applied Sciences
              <br />
              Department of Computer Science
              <br />
              <abbr title="Phone">P:</abbr> +94 112 803 803
              <br />
              <abbr title="Email">E:</abbr> info@guru.lk
            </address>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="text-center text-white">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} GURU.Ik - All Rights Reserved
            </p>
            <small>Developed by AS2022466, AS2022468, AS2022471</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
