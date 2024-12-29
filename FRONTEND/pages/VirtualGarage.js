import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Profile from '../assests/profile.png';
import '../styles/virtualGarage.css';
import '../styles/notificationSection.css';
import Notification from '../components/NotificationSection';
import Productlist from "../components/ProductList";
import Viewpost from '../pages/Viewmypost';
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import Add from '../assests/Add.png'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Blog from "./Blog";


const VirtualGarage = () => {
  const [activeSection, setActiveSection] = useState('viewVehicle');
  const [vehicles, setVehicles] = useState([]);
  const [items,setItems]= useState([]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editVehicle, setEditVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    images: [null, null, null],
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useContext(UserContext);
  

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/vehicleProfiles/get/${user.id}`);
      console.log('Full API Response:', response);
  
      const vehiclesData = Array.isArray(response.data)
        ? response.data.map(vehicle => ({
            id: vehicle._id,
            images: vehicle.images.map(image => `http://localhost:3001/${image.replace(/\\/g, '/')}`),
            description: vehicle.description,
          }))
        : [];
  
      console.log('Processed Vehicles Data:', vehiclesData);
  
      setVehicles(vehiclesData);
      setCurrentVehicleIndex(0);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error fetching vehicle profiles:', error);
    }
  };
  
  
  // Fetch vehicles when the user ID changes
  useEffect(() => {
    if (user && user.id) {
      fetchVehicles();
    }
  }, [user]);
  

  const fetchutems = async () => {
    try {
      console.log(user.id);
      // Fetch the order details
      const response = await axios.get(`http://localhost:3001/customised/get/${user.id}`);
      console.log('Order details:', response.data);
  
      // Extract product IDs from the response
      const products = response.data.products;
      if (Array.isArray(products) && products.length > 0) {
        // Assuming you want to get the productID of the first product
        const firstProductID = products[0].productID;
        console.log('Product ID of the first product:', firstProductID);
  
        // Fetch category details using the productID
        const cidResponse = await axios.get(`http://localhost:3001/customised/get_c/${firstProductID}`);
        console.log('Category ID Response:', cidResponse.data);
  
        // Handle response as an array if needed
        const cid = cidResponse.data.length > 0 ? cidResponse.data[0].categoryId : null;
  
        if (cid) {
          // Fetch product details by category ID
          const productsResponse = await axios.get(`http://localhost:3001/customised/get_cname/${cid}`);
          console.log('Products Response:', productsResponse.data);
  
          // Set items and log them
          setItems(productsResponse.data);
          console.log('Items:', productsResponse.data);
        } else {
          console.log('Category ID not found.');
        }
      } else {
        console.log('No products found in the response.');
      } 
    } catch (err) {
      console.error('Error fetching vehicles:', err.message);
    }
  };
  
  // Fetch vehicles when the user ID changes
  useEffect(() => {
    if (user && user.id) {
      fetchutems();
    }
  }, [user]);

  useEffect(() => {
    console.log('Vehicles State:', vehicles);
    console.log('Current Vehicle Index:', currentVehicleIndex);
  }, [vehicles, currentVehicleIndex]);
  



  const responsiveSettings = [
    {
        breakpoint: 800,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 3
        }
    },
    {
        breakpoint: 500,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
    }
];
  


  //const customerId = '6665bde883d0b1be9c618c55';

  const handleNextImage = () => {
    console.log('Handle next image');
    setCurrentImageIndex(prevIndex =>
      prevIndex === vehicles[currentVehicleIndex].images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    console.log('Handle previous image');
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? vehicles[currentVehicleIndex].images.length - 1 : prevIndex - 1
    );
  };

  const handleNextVehicle = () => {
    console.log('Current Vehicle Index:', currentVehicleIndex);
    if (vehicles.length > 0) {
      console.log(vehicles.length);
      const nextIndex = (1) % vehicles.length;
      console.log('Next Vehicle Index:', nextIndex);
      setCurrentVehicleIndex(nextIndex);
      setCurrentImageIndex(0);
    } else {
      console.error('No vehicles available to navigate.');
    }
  };
  
  
  const handlePrevVehicle = () => {
    setCurrentVehicleIndex(prevIndex => {
      const prevIndexWrap = (prevIndex - 1 + vehicles.length) % vehicles.length;
      console.log(`Current Vehicle Index: ${prevIndex}, Previous Vehicle Index: ${prevIndexWrap}`);
      return prevIndexWrap;
    });
    setCurrentImageIndex(0); // Reset image index to 0
  };
  
  

  const handleAddVehicle = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', newVehicle.description);
    formData.append('customerId', user.id);

    newVehicle.images.forEach((image) => {
      if (image) {
        formData.append('images', image);
      }
    });

    try {
      const response = await axios.post('http://localhost:3001/vehicleProfiles/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVehicles([...vehicles, { ...response.data, id: vehicles.length + 1 }]);
      setNewVehicle({ images: [null, null, null], description: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding vehicle:', error.response ? error.response.data : error.message);
      alert("Pleas add 3 images");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...newVehicle.images];
    
    files.forEach((file, fileIndex) => {
      if (fileIndex < newImages.length) {
        newImages[fileIndex] = file;
      }
    });

    while (newImages.length < 3) {
      newImages.push(null);
    }

    setNewVehicle({ ...newVehicle, images: newImages });
  };

  const handleEditImageChange = (e, index) => {
    const file = e.target.files[0];
    const newImages = [...editVehicle.images];
    newImages[index] = file;
    setEditVehicle({ ...editVehicle, images: newImages });
  };

  const handleEditVehicle = (id) => {
    const vehicleToEdit = vehicles.find((vehicle) => vehicle.id === id);
    setEditVehicle(vehicleToEdit);
  };

  const handleDeleteVehicle = async (id) => {
    console.log(id);
    const confirmed = window.confirm('Are you sure you want to delete this vehicle profile?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3001/vehicleProfiles/delete/${id}`);
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        setActiveSection('viewVehicle');
      } catch (error) {
        console.error('Error deleting vehicle:', error.response ? error.response.data : error.message);
        window.alert('Error deleting vehicle. Please try again.');
      }
    }
  };

  const handleSaveEditVehicle = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('description', editVehicle.description);
    formData.append('customerId', user.id);
  
    editVehicle.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append('images', image);
      } else {
        console.warn(`Image at index ${index} is a URL. Please replace it with a file.`);
      }
    });
  
    if (editVehicle.images.length < 3) {
      console.error('Exactly 3 images are required');
      window.alert('Please upload exactly 3 images');
      return;
    }
  
    try {
      console.log('Updating vehicle with formData:', ...formData);
      const response = await axios.put(`http://localhost:3001/vehicleProfiles/edit/${editVehicle.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setVehicles(vehicles.map((vehicle) =>
        vehicle.id === response.data.id ? response.data : vehicle
      ));
  
      setEditVehicle(null);
      setActiveSection('viewVehicle');
    } catch (error) {
      console.error('Error updating vehicle:', error.response ? error.response.data : error.message);
      window.alert('Please fill all fields,including images');
    }
  };

  const handleSectionClick = (section) => {
    console.log(`Navigating to section: ${section}`);
    setActiveSection(section);
  };

  

  const renderContent = () => {
    console.log(`Rendering content for section: ${activeSection}`);

    if (showAddForm) {
      return (
        <div className="card1 add-vehicle-form">
      <h2>Add New Vehicle Profile</h2>
      <form onSubmit={handleFormSubmit}>
        <input type="hidden" name="customerId" value={user.id} />
        <div className="form-group">
          <label>
            <strong>Vehicle Images: (Add 3 images)</strong>
            <input 
              type="file" 
              multiple 
              className="form-control" 
              onChange={handleImageChange}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <strong>Description:</strong>
            <textarea 
              value={newVehicle.description} 
              onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
              className="form-control"
              required
            />
          </label>
        </div>
        <button type="submit">Add Vehicle</button>
        <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
      </form>
    </div>
  );
      
    }

    if (editVehicle) {
      return (
        <div className="card1 add-vehicle-form">
          <h2>Edit Vehicle Profile</h2>
          <form onSubmit={handleSaveEditVehicle}>
            <input type="hidden" name="customerId" value={user.id} />
            <div className="form-group">
              <label>
                <strong>Vehicle Images:</strong>
                {editVehicle.images.map((image, index) => (
                  <div key={index}>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleEditImageChange(e, index)}
                    />
                    {image && typeof image !== 'string' && (
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        style={{ width: '100px', height: '100px' }}
                      />
                    )}
                  </div>
                ))}
              </label>
            </div>
            <div className="form-group">
              <label>
                <strong>Description:</strong>
                <textarea
                  value={editVehicle.description}
                  onChange={(e) => setEditVehicle({ ...editVehicle, description: e.target.value })}
                  className="form-control"
                  required
                />
              </label>
            </div>
            <button type="submit">Edit</button>
            <button type="button" onClick={() => setEditVehicle(null)}>Cancel</button>
          </form>
        </div>
      );
    }

    if (activeSection === 'viewVehicle') {
      console.log('Rendering vehicle profile section');

      if (!vehicles || vehicles.length === 0) {
        return <p>Add your vehicle profiles here<button className="button" onClick={handleAddVehicle}> <img src={Add} alt="logo" width="30" height="30" /></button></p>;
      }

      const currentVehicle = vehicles[currentVehicleIndex];

      if (!currentVehicle || !currentVehicle.images || currentVehicle.images.length === 0) {
        return <p>No images</p>;
      }

      return (
        <div className="vehicle-profile-section">
          <h2>Vehicle Profile</h2>
          <div className="vehicle-profile-container">
            <button className="nav-button" onClick={handlePrevVehicle}>Previous Vehicle</button>
            <div className="vehicle-profile-card">
              <div className="vehicle-images">
              <img 
  src={currentVehicle.images[currentImageIndex]} 
  alt="Vehicle" 
  onError={(e) => { 
    console.error(`Image failed to load: ${currentVehicle.images[currentImageIndex]}`); 
    e.target.src = '/path/to/your/default-image.jpg'; 
  }} 
  style={{ width: '100%', height: 'auto' }}
/>

                <div className="image-nav-buttons">
                  <button className="nav-button" onClick={handlePrevImage}>Previous Image</button>
                  <button className="nav-button" onClick={handleNextImage}>Next Image</button>
                </div>
              </div>
              <div className="vehicle-description">
                <p>{currentVehicle.description}</p>
              </div>
            </div>
            <button className="nav-button" onClick={handleNextVehicle}>Next Vehicle</button>
          </div>
          <div className="button-container">
            <button className="button1" style={{ backgroundColor: '#081F62'}} onClick={handleAddVehicle}>Add Vehicle</button>
            <button className="button2" style={{backgroundColor: '#808080'}} onClick={() => handleEditVehicle(currentVehicle.id)}>Edit Vehicle</button>
            <button className="button3" style={{backgroundColor: '#dc3545'}} onClick={() => handleDeleteVehicle(currentVehicle.id)}>Remove</button>
          </div>
        </div>
       

      ); 
    }
    
    if (activeSection === 'notifications') {
      return <Notification />;
    }
    if (activeSection === 'community') {
      return <Blog />;
    }
    if (activeSection === 'myposts') {
      return <Viewpost />;
    }
    
  };

  return (
    <div>
    <div className="virtual-garage-container">
      <div className="sidebar">
        <img src={Profile} alt="Profile" className="profile-img" />
        <button className="sidebar-btn" onClick={() => handleSectionClick('viewVehicle')}>View Vehicle Profiles</button>
        <button className="sidebar-btn" onClick={() => handleSectionClick('notifications')}>Notifications</button>
        <button className="sidebar-btn" onClick={() => handleSectionClick('community')}>Community</button>
        {activeSection === 'community' && (
        <button className="sidebar-btn" onClick={() => handleSectionClick('myposts')}>View Your Posts</button>
      )}
      </div>
      <div className="main-content">
        {renderContent()}
        
      </div>

     {/* <MDBFooter className='text-center text-lg-start text-muted' style={{ backgroundColor: '#0d0d38' }}>
  <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
    <div>
      {items.length > 0 ? (
        <Slide slidesToScroll={2} slidesToShow={2} indicators={true} responsive={responsiveSettings}>
          {items.map((item, index) => (
            <div className="item-list-item" key={index}>
              <img src="https://via.placeholder.com/150" alt="Test Image" />

              <a className="nav-link" href={`/View_Cart_item/${item._id}`}>
                <button className="item-list-item-button">Read More</button>
              </a>
            </div>
          ))}
        </Slide>
      ) : (
        <p>Purchase some products to see images here!</p>
      )}
    </div>
  </section>
</MDBFooter>*/}

    </div>

    <MDBFooter>
    <Productlist/>
    </MDBFooter>


    <Footer className="footer">
        <Footer/>
      </Footer>
    </div>
     
  );
};

export default VirtualGarage;
