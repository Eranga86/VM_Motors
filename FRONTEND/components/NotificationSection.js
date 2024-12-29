import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Notify from '../assests/survey.gif';
import '../styles/notificationSection.css';
import { UserContext } from "../context/UserContext";

const NotificationSection = () => {
  const [activeNotification, setActiveNotification] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showSurveyS, setShowSurveyS] = useState(false);
  const [showSurveyI, setShowSurveyI] = useState(false);
  const [notificationsEx, setNotificationsEx] = useState([]);
  const [notificationsI, setNotificationsI] = useState([]);
  const [notificationsS, setNotificationsS] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsi, setProductsi] = useState([]);
  const [productsS, setProductsS] = useState([]);
  const [activeSurveyNotificationS, setActiveSurveyNotificationS] = useState(null);
  const [activeSurveyNotificationI, setActiveSurveyNotificationI] = useState(null);
  const [responses, setResponses] = useState({});
  
  //const userId = '6665bde883d0b1be9c618c55';
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchNotifications = async (type, setNotifications, setProducts) => {
      try {
        const response = await axios.get(`http://localhost:3001/notifications/get_notifications/${user.id}/${type}`);
        setNotifications(response.data);

        const productPromises = response.data.map(notification =>
          axios.get(`http://localhost:3001/spareParts/${notification.productId}`).then(response => response.data).catch(error => null)
        );

        const products = await Promise.all(productPromises);
        setProducts(products);
      } catch (error) {
        console.error(`Error fetching ${type} notifications:`, error);
      }
    };


    fetchNotifications('Expiration',setNotificationsEx, setProducts);
    fetchNotifications('InitialSurvey', setNotificationsI, setProductsi);
    fetchNotifications('Survey' ,setNotificationsS, setProductsS);
  }, [user.id]);

  useEffect(() => {
    console.log('Notifications:', notificationsS);
  }, [notificationsS]);

  const handleNotificationClick = (type) => {
    setActiveNotification(type);
  };

  const handleNotifications = (n_id) => {
    axios.put(`http://localhost:3001/notifications/notification/viewed/${n_id}`)
      .then(response => {
        console.log('notified:', response.data);

        
      })
      .catch(error => {
        console.error('Error in notifying:', error);
      });
  };

  const handleSurveyClickS = (categoryId) => {
    setQuestions([]); // Clear previous questions
    console.log('Fetching survey questions for categoryId:', categoryId);

    axios.get(`http://localhost:3001/surveyQuestions/get/${categoryId}`)
      .then(response => {
        console.log('Survey questions response:', response.data);

        if (response.data && response.data.questions) {
          setQuestions(response.data.questions);
        } else {
          console.error('No questions found in response data.');
          setQuestions([]);
        }
      })
      .catch(error => {
        console.error('Error fetching survey questions:', error);
      });

    setActiveSurveyNotificationS(categoryId);
    setShowSurveyS(true);
  };

  const handleSurveyClickI = (categoryId) => {
    setActiveSurveyNotificationI(categoryId);
    setShowSurveyI(true);
  };

  const handleSurveyCloseS = () => {
    setActiveSurveyNotificationS(null);
    setShowSurveyS(false);
  };

  const handleSurveyCloseI = () => {
    setActiveSurveyNotificationI(null);
    setShowSurveyI(false);
  };

  // Handle change event
  const handleChange = (questionName, answerValue) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionName]: answerValue
    }));
  };

  const validateSurveyResponses = (responses, questions) => {
    // Check if all questions have been answered
    for (const question of questions) {
      if (!responses[question.questionName] || responses[question.questionName].trim() === '') {
        return false;
      }
    }
    return true;
  };


  const handleSurveySubmitS = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const surveyResponses = Object.fromEntries(formData.entries());
    const customerId = surveyResponses.customerId;
    const productId = surveyResponses.productId;
    const n_id = surveyResponses.n_id
   console.log(surveyResponses.categoryId);
    let route;
    switch (surveyResponses.categoryId) {
      case '66952f0f7467f4e4b0f30118':
        route = '/submit-survey_CoolingParts';
        break;
      case '66952f3a7467f4e4b0f30147':
        route = '/submit-survey_ExteriorParts';
        break;
      case '66952f2d7467f4e4b0f30138':
        route = '/submit-survey_InteriorParts';
        break;
      case '66952f5a7467f4e4b0f30168':
        route = '/submit-survey_MechanicalParts';
        break;
      default:
        console.error('Unknown category');
        return;
    }

    if (!customerId || !productId || !surveyResponses.categoryId || !surveyResponses.currentMileage || !surveyResponses.averageDailyMonthlyMileage) {
      alert('Please fill out all required fields.');
      return;
    }

    

    const formattedResponses = {
      currentMileage: surveyResponses.currentMileage || '',
      averageDailyMonthlyMileage: surveyResponses.averageDailyMonthlyMileage || '',
      ...questions.reduce((acc, question) => {
        acc[question.questionName] = responses[question.questionName] || '';
        return acc;
      }, {})
    };

    if (!validateSurveyResponses(responses, questions)) {
      alert('Please answer all survey questions.');
      return;
    }

    const surveyData = {
      customerId,
      productId,
      surveyResponses: formattedResponses
    };

    console.log('Submitting survey data:', surveyData);

    axios.post(`http://localhost:3001/survey_data${route}`, surveyData)
      .then(response => {
        console.log('Survey submitted successfully:', response.data);
        alert("Survey submitted!");
        setShowSurveyS(false);
      })
      .catch(error => {
        console.error('Error submitting survey:', error);
      });
   
      handleNotifications(n_id);
      
  };


  const handleSurveySubmitI = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const surveyResponses = Object.fromEntries(formData.entries());
    const customerId = surveyResponses.customerId;
    const productId = surveyResponses.productId;
    const categoryId = surveyResponses.categoryId;
    const n_id = surveyResponses.n_id

    let route;
    switch (surveyResponses.categoryId) {
      case '66952f0f7467f4e4b0f30118':
        route = '/initialize-CoolingParts_lifespan';
        break;
      case '66952f3a7467f4e4b0f30147':
        route = '/initialize-Exterior_lifespan';
        break;
      case '66952f2d7467f4e4b0f30138':
        route = '/initialize-Interior_lifespan';
        break;
      case '66952f5a7467f4e4b0f30168':
        route = '/initialize-Mechanical_lifespan';
        break;
      default:
        console.error('Unknown category');
        return;
    }

    const formattedResponses = {
      installationDate: surveyResponses.installationDate || '',
      ...questions.reduce((acc, question) => {
        acc[question.questionName] = responses[question.questionName] || '';
        return acc;
      }, {})
    };

    const surveyData = {
      customerId,
      productId,
      categoryId,
      surveyResponses: formattedResponses
    };

    console.log('Submitting initial survey data:', surveyData);
    console.log('submitting');
    axios.post(`http://localhost:3001/lifespanInitialisingAll${route}`, surveyData)
      .then(response => {
        console.log('Survey submitted successfully:', response.data);
        alert("Survey submitted!");
        setShowSurveyI(false);
      })
      .catch(error => {
        console.error('Error submitting survey:', error);
      });
   
      handleNotifications(n_id);
      
  };

  return (
    <div className="notification-section">
      <h2>Notifications</h2>
      <div className="notification-buttons">
        <button className="button1" style={{ backgroundColor: '#535F80'}} onClick={() => handleNotificationClick('replacement')}>Replacement Notification</button>
        <button className="button1" style={{ backgroundColor: '#224b76'}}onClick={() => handleNotificationClick('survey')}>Survey Notification</button>
      </div>

      {activeNotification === 'replacement' && (
        <div className="notification-details">
          <h3>Expiration Notification</h3>
          {notificationsEx.map((notification, index) => (
            <div key={notification._id} className="notification-card">
              {products[index] && (
                <React.Fragment>
                  <img 
                    src={`data:image/png;base64,${products[index].image}`} 
                    className="card-img-top clickable-image" 
                    alt={products[index].name} 
                  />
                  <p>{notification.message}</p>
                  <button onClick={() => handleNotifications(notification._id)}>Noted</button>
                </React.Fragment>
              )}
            </div>
          ))}
        </div>
      )}

{activeNotification === 'survey' && (
        <div className="notification-details">
          <h3>Initial Notification</h3>
          {notificationsI.map((notification, index) => (
            <div key={notification._id} className="notification-card">
              {productsi[index] && (
                <React.Fragment>
                  <img 
                    src={`data:image/png;base64,${productsi[index].image}`}
                    style={{ width: '250px', height: '250px' }}
                    className="card-img-top clickable-image" 
                    alt={productsi[index].name} 
                  />
                  <p>{notification.message}</p>
                  <button style={{ backgroundColor: '#081F62', color: 'white' }} onClick={() => handleSurveyClickI(notification.categoryId)}>Fill this survey</button>
                </React.Fragment>
              )}
            </div>
          ))}
        </div>
      )}
      

      {activeNotification === 'survey' && (
        <div className="notification-details">
          <h3>Survey Notifications</h3>
          {notificationsS.map((notification, index) => (
            <div key={notification._id} className="notification-card">
              {productsS[index] && (
                <React.Fragment>
                  <img 
                    src={`data:image/png;base64,${productsS[index].image}`} 
                    className="card-img-top clickable-image" 
                    alt={productsS[index].name} 
                  />
                  <p>{notification.message}</p>
                  <button className="btn btn-primary" onClick={() => handleSurveyClickS(notification.categoryId)}>Fill this survey</button>
                </React.Fragment>
              )}
            </div>
          ))}

{showSurveyS && activeSurveyNotificationS && (
  <div className="survey-form-container">
    <h3>Survey for Category ID: {activeSurveyNotificationS}</h3>
    <button className="close-icon" onClick={handleSurveyCloseS}>X</button>
    <form onSubmit={handleSurveySubmitS}>
      <input type="hidden" name="customerId" value={user.id} />
      <input type="hidden" name="categoryId" value={activeSurveyNotificationS} />
      {/* Find the correct productId based on the active notification */}
      {notificationsS.map((notification, index) => (
        notification.categoryId === activeSurveyNotificationS ? (
          <input key={notification._id} type="hidden" name="productId" value={productsS[index]?._id} />
        ) : null
      ))}
      <input type="hidden" name="categoryId" value={activeSurveyNotificationS} />
      {/* Find the correct n_id based on the active notification */}
      {notificationsS.map((notification) => (
        notification.categoryId === activeSurveyNotificationS ? (
          <input key={notification._id} type="hidden" name="n_id" value={notification._id} />
          
          
        ) : null
      ))}
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question._id} className="survey-question">
            <h4>{question.questionText}</h4>
            <div className="survey-options">
              {question.answers.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name={question.questionName}
                    value={option.value}
                    onChange={() => handleChange(question.questionName, option.value)}
                  />
                  {option.text}
                </label>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No questions available</p>
      )}
      <div className="survey-question">
        <h4>What is the current Millage?</h4>
        <input
          type="number"
          name="currentMileage"
          onChange={(e) => handleChange('currentMileage', e.target.value)}
        />
      </div>
      <div className="survey-question">
        <h4>What is the average daily monthly mileage?</h4>
        <input
          type="number"
          name="averageDailyMonthlyMileage"
          onChange={(e) => handleChange('averageDailyMonthlyMileage', e.target.value)}
        />
      </div>
      <br/>
      <button
  style={{
    backgroundColor: '#081F62',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  }}
  type="submit"
>
  Submit
</button>
    </form>
  </div>
)}

{showSurveyI && activeSurveyNotificationI && (
  <div className="survey-form-container">
    <h3>Initialisng the survey</h3>
    <button className="close-icon" onClick={handleSurveyCloseI}>X</button>
    <form onSubmit={handleSurveySubmitI}>
      <input type="hidden" name="customerId" value={user.id} />
      {/* Find the correct productId based on the active notification */}
      {notificationsI.map((notification, index) => (
        notification.categoryId === activeSurveyNotificationI ? (
          <input key={notification._id} type="hidden" name="productId" value={notification.productId} />
        ) : null
      ))}
      <input type="hidden" name="categoryId" value={activeSurveyNotificationI} />
      {/* Find the correct n_id based on the active notification */}
      {notificationsI.map((notification) => (
        notification.categoryId === activeSurveyNotificationI ? (
          <input key={notification._id} type="hidden" name="n_id" value={notification._id} />
        ) : null

        
      ))}

{notificationsI.map((notification) => (
        notification.categoryId === activeSurveyNotificationI ? (
          <input key={notification._id} type="hidden" name="productId" value={notification.productId} />
        ) : null

        
      ))}
      
      <div className="survey-question">
      <h4>What is the intallation date?</h4>
        <input
          type="date"
          name="installationDate"
          onChange={(e) => handleChange('installationDate', e.target.value)}
        />
      </div>
      <br/>
      <button
  style={{
    backgroundColor: '#081F62',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  }}
  type="submit"
>
  Submit
</button>
    </form>
  </div>
)}

        </div>
      )}
    </div>
  );
};

export default NotificationSection;
