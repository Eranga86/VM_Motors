import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Logo from "../assests/logo.jpeg";

const Footer = () => {
  return (
    <MDBFooter
      className="text-center text-lg-start text-muted"
      style={{ backgroundColor: "#1f1f7a" }}
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block" style={{ color: "white" }}>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a
            href="https://m.facebook.com/profile.php?id=100063855769874&name=xhp_nt__fb__action__open_user"
            className="me-4 text-reset"
          >
            <MDBIcon fab icon="facebook-f" style={{ color: "white" }} />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="twitter" style={{ color: "white" }} />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="google" style={{ color: "white" }} />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="instagram" style={{ color: "white" }} />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="linkedin" style={{ color: "white" }} />
          </a>
        </div>
      </section>

      <section>
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6
                className="text-uppercase fw-bold mb-4"
                style={{ color: "white" }}
              >
                <MDBIcon icon="map" className="me-3" />
                Our Location
              </h6>
              <p style={{ color: "white" }}>329A HIGH LEVEL ROAD,</p>
              <p style={{ color: "white" }}>Pannipitiya,</p>
              <p style={{ color: "white" }}>Sri Lanka</p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6
                className="text-uppercase fw-bold mb-4"
                style={{ color: "white" }}
              >
                Categories
              </h6>
              <p style={{ color: "white" }}>Cooling System Parts</p>
              <p style={{ color: "white" }}>Interior Parts</p>
              <p style={{ color: "white" }}>Exterior Parts</p>
              <p style={{ color: "white" }}>Mechanical Parts</p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6
                className="text-uppercase fw-bold mb-4"
                style={{ color: "white" }}
              >
                Useful links
              </h6>
              <p style={{ color: "white" }}>
                <a href="#!" className="text-reset" style={{ color: "white" }}>
                  Pricing
                </a>
              </p>
              <p style={{ color: "white" }}>
                <a href="#!" className="text-reset" style={{ color: "white" }}>
                  Orders
                </a>
              </p>
              <p style={{ color: "white" }}>
                <a href="#!" className="text-reset" style={{ color: "white" }}>
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6
                className="text-uppercase fw-bold mb-4"
                style={{ color: "white" }}
              >
                Contact
              </h6>
              <p style={{ color: "white" }}>
                <MDBIcon
                  icon="home"
                  className="me-2"
                  style={{ color: "white" }}
                />
                329A HIGH LEVEL ROAD, Pannipitiya, Sri Lanka
              </p>
              <p style={{ color: "white" }}>
                <MDBIcon
                  icon="envelope"
                  className="me-3"
                  style={{ color: "white" }}
                />
                veracrish@yahoo.com
              </p>
              <p style={{ color: "white" }}>
                <MDBIcon
                  icon="phone"
                  className="me-3"
                  style={{ color: "white" }}
                />{" "}
                076 289 9225
              </p>
              <p style={{ color: "white" }}>
                <MDBIcon
                  icon="print"
                  className="me-3"
                  style={{ color: "white" }}
                />{" "}
                + 01 234 567 89
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className="text-center p-4" style={{ backgroundColor: "#191966" }}>
        <p style={{ color: "white" }}>© 2024 V&M Motors:</p>
        <img src={Logo} alt="" width="180px" height="80px" />
      </div>
    </MDBFooter>
  );
};

export default Footer;
