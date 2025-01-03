import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/admindashboard.css";

const Admindashboard = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showDeleteSupplierModal, setShowDeleteSupplierModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showDeleteCustomerModal, setShowDeleteCustomerModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false);
  const [showAddPartsModal, setShowAddPartsModal] = useState(false);
  const [showDeletePartsModal, setShowDeletePartsModal] = useState(false);

  const handleAddSupplier = () => {
    setShowAddSupplierModal(true);
  };

  const handleCloseAddSupplierModal = () => {
    setShowAddSupplierModal(false);
  };

  const handleAddSupplierSubmit = () => {
    handleCloseAddSupplierModal();
  };

  const handleDeleteSupplier = () => {
    setShowDeleteSupplierModal(true);
  };

  const handleCloseDeleteSupplierModal = () => {
    setShowDeleteSupplierModal(false);
  };

  const handleDeleteSupplierSubmit = () => {
    handleCloseDeleteSupplierModal();
  };

  const handleAddCustomer = () => {
    setShowAddCustomerModal(true);
  };

  const handleCloseAddCustomerModal = () => {
    setShowAddCustomerModal(false);
  };

  const handleAddCustomerSubmit = () => {
    handleCloseAddCustomerModal();
  };

  const handleDeleteCustomer = () => {
    setShowDeleteCustomerModal(true);
  };

  const handleCloseDeleteCustomerModal = () => {
    setShowDeleteCustomerModal(false);
  };

  const handleDeleteCustomerSubmit = () => {
    handleCloseDeleteCustomerModal();
  };

  const handleEditOrder = () => {
    setShowEditOrderModal(true);
  };

  const handleCloseEditOrderModal = () => {
    setShowEditOrderModal(false);
  };

  const handleEditOrderSubmit = () => {
    handleCloseEditOrderModal();
  };

  const handleDeleteOrder = () => {
    setShowDeleteOrderModal(true);
  };

  const handleCloseDeleteOrderModal = () => {
    setShowDeleteOrderModal(false);
  };

  const handleDeleteOrderSubmit = () => {
    handleCloseDeleteOrderModal();
  };

  const handleAddParts = () => {
    setShowAddPartsModal(true);
  };

  const handleCloseAddPartsModal = () => {
    setShowAddPartsModal(false);
  };

  const handleAddPartsSubmit = () => {
    handleCloseAddPartsModal();
  };

  const handleDeleteParts = () => {
    setShowDeletePartsModal(true);
  };

  const handleCloseDeletePartsModal = () => {
    setShowDeletePartsModal(false);
  };

  const handleDeletePartsSubmit = () => {
    handleCloseDeletePartsModal();
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid no-padding-container">
        {/* Navigation */}
        <div className="navigation">
          <ul>
            <li>
              <a href="#">
                <span style={{ margin: 10 }} className="title">
                  V & M Motors
                </span>
              </a>
            </li>
            <li>
              <a
                id="Dashboardbutton"
                href="#"
                onClick={() => setActiveSection("")}
              >
                <span className="title">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                id="Customermanagementbutton"
                href="#"
                onClick={() => setActiveSection("customerManagement")}
              >
                <span className="title">Customer Management</span>
              </a>
            </li>
            <li>
              <a
                id="SupplierManagementbutton"
                href="#"
                onClick={() => setActiveSection("supplierManagement")}
              >
                <span className="title">Supplier Management</span>
              </a>
            </li>
            <li>
              <a
                id="OrderManagementbutton"
                href="#"
                onClick={() => setActiveSection("orderManagement")}
              >
                <span className="title">Order Management</span>
              </a>
            </li>
            <li>
              <a
                id="SparepartsManagementbutton"
                href="#"
                onClick={() => setActiveSection("sparePartsManagement")}
              >
                <span className="title">Spare Parts Management</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span className="title">Home</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span className="title">Profile</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="toggle"></div>
            <div className="user"></div>
          </div>

          {/* Cards */}
          <div className="cardBox">
            <div className="card">
              <div>
                <div className="numbers"></div>
                <div className="cardName">Customers</div>
              </div>
              <div>
                <p
                  style={{
                    color: "#cccccc",
                    fontSize: "23px",
                    fontWeight: "bold",
                  }}
                >
                  50
                </p>
              </div>
            </div>
            <div className="card">
              <div>
                <div className="numbers"></div>
                <div className="cardName">Suppliers</div>
              </div>
              <div>
                <p
                  style={{
                    color: "#cccccc",
                    fontSize: "23px",
                    fontWeight: "bold",
                  }}
                >
                  20
                </p>
              </div>
            </div>
            <div className="card">
              <div>
                <div className="numbers"></div>
                <div className="cardName">Orders</div>
              </div>
              <div>
                <p
                  style={{
                    color: "#cccccc",
                    fontSize: "23px",
                    fontWeight: "bold",
                  }}
                >
                  100
                </p>
              </div>
            </div>
            <div className="card">
              <div>
                <div className="numbers"></div>
                <div className="cardName">Spare Parts</div>
              </div>
              <div>
                <p
                  style={{
                    color: "#cccccc",
                    fontSize: "23px",
                    fontWeight: "bold",
                  }}
                >
                  500
                </p>
              </div>
            </div>
          </div>

          {/* Details of Supplier Management */}
          {activeSection === "supplierManagement" && (
            <div className="recentCustomers" id="Suppliertable">
              <div className="cardHeader">
                <h2>Supplier Management</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Company Name</td>
                      <td>Spare Part Details</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={handleAddSupplier}
                        >
                          Add Supplier
                        </button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>001</td>
                      <td>002</td>
                      <td>003</td>
                      <td>004</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={handleDeleteSupplier}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showAddSupplierModal && (
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Supplier</h4>
                  <span className="close" onClick={handleCloseAddSupplierModal}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                      />
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                      />
                      <label htmlFor="companyName" className="form-label">
                        Company Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        aria-describedby="companyNameHelp"
                      />
                      <label htmlFor="sparePartDetails" className="form-label">
                        Spare Part Details
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="sparePartDetails"
                        name="sparePartDetails"
                        aria-describedby="sparePartDetailsHelp"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleAddSupplierSubmit}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {showDeleteSupplierModal && (
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 class="modal-title">
                    Are you sure you want to delete this supplier?
                  </h4>
                  <span
                    className="close"
                    onClick={handleCloseDeleteSupplierModal}
                  >
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleDeleteSupplierSubmit}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={handleDeleteSupplierSubmit}
                    >
                      No
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          {/*Customer details */}
          {activeSection === "customerManagement" && (
            <div className="recentCustomers" id="Customertable">
              <div className="cardHeader">
                <h2>Customer Management</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Username</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={handleAddCustomer}
                        >
                          Add Customer
                        </button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>001</td>
                      <td>001</td>
                      <td>001</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={handleDeleteCustomer}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showAddCustomerModal && (
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Customer</h4>
                  <span className="close" onClick={handleCloseAddCustomerModal}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                      />
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                      />
                      <label htmlFor="companyName" className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        aria-describedby="companyNameHelp"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleAddCustomerSubmit}
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {showDeleteCustomerModal && (
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 class="modal-title">
                    Are you sure you want to delete this customer?
                  </h4>
                  <span
                    className="close"
                    onClick={handleCloseDeleteCustomerModal}
                  >
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleDeleteCustomerSubmit}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={handleDeleteCustomerSubmit}
                    >
                      No
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          {/*Order Details*/}
          {activeSection === "orderManagement" && (
            <div className="recentCustomers" id="Ordertable">
              <div className="cardHeader">
                <h2>Order Details</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <td>Order No:</td>
                    <td>Short Description</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={handleEditOrder}
                      >
                        Edit Order
                      </button>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>001</td>
                    <td>gfghg</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={handleDeleteOrder}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {showEditOrderModal && (
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Edit Order</h4>
                  <span className="close" onClick={handleCloseEditOrderModal}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Order No:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                      />
                      <label htmlFor="email" className="form-label">
                        Order Items
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                      />
                      <label htmlFor="companyName" className="form-label">
                        Delivery status
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        aria-describedby="companyNameHelp"
                      />
                      <label htmlFor="companyName" className="form-label">
                        Payment
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        aria-describedby="companyNameHelp"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleEditOrderSubmit}
                    >
                      Edit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {showDeleteOrderModal && (
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 class="modal-title">
                    Are you sure you want to delete this order?
                  </h4>
                  <span className="close" onClick={handleCloseDeleteOrderModal}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleDeleteOrderSubmit}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={handleDeleteOrderSubmit}
                    >
                      No
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/*Spare parts Details */}

          {activeSection === "sparePartsManagement" && (
            <div className="recentCustomers" id="Sparepartstable">
              <div className="cardHeader">
                <h2>Spare Parts Details</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Image</td>
                    <td>Category</td>
                    <td>Bus Model</td>
                    <td>Price</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={handleAddParts}
                      >
                        Add Spare Parts
                      </button>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>001</td>
                    <td>gfghg</td>
                    <td>gfghg</td>
                    <td>gfghg</td>
                    <td>gfghg</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={handleDeleteParts}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {showAddPartsModal && (
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Spare Part</h4>
                  <span className="close" onClick={handleCloseAddPartsModal}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                      />
                      <label htmlFor="email" className="form-label">
                        Image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="myfile"
                        name="image"
                        aria-describedby="emailHelp"
                      />
                      <label htmlFor="companyName" className="form-label">
                        Category
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        aria-describedby="companyNameHelp"
                      />
                      <label htmlFor="companyName" className="form-label">
                        Bus Model
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        aria-describedby="companyNameHelp"
                      />
                      <label htmlFor="companyName" className="form-label">
                        Price
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        aria-describedby="companyNameHelp"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleAddPartsSubmit}
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {showDeletePartsModal && (
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 class="modal-title">
                    Are you sure you want to delete this Spare part?
                  </h4>
                  <span className="close" onClick={handleCloseDeletePartsModal}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleDeletePartsSubmit}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={handleDeletePartsSubmit}
                    >
                      No
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Admindashboard;
