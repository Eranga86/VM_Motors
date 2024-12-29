const express = require("express");
const cors = require("cors");
const path = require('path');

const moment = require('moment-timezone');
const mongoose = require('mongoose');
const CoolingSystemLifespan = require('./models/CoolingPartsLifespan.js');
const InteriorSystemLifespan = require('./models/InteriorPartsLifespan.js');
const MechanicalSystemLifespan = require('./models/MechanicalPartsLifespan.js');
const ExteriorSystemLifespan = require('./models/ExteriorPartsLifespan.js');




const Notification = require('./models/Notification.js');

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require('./Mongodb.js');
const sparePartsRouter = require('./routes/SparePart');
const busModelsRouter = require('./routes/BusModel');
const addToCartRouter = require('./routes/AddToCart');
const ordersRouter = require('./routes/Order');
const categoriesRouter = require('./routes/Category');
const proceedToCheckout = require('./routes/ProceedToCheckout');
const billingDetails = require('./routes/BillingDetails');
const shippingDetails = require('./routes/ShippingDetails.js');
const purchase = require('./routes/PurchaseData.js');
const surveyQuestions = require('./routes/SurveyQuestions.js');
const notifications = require('./routes/SurveyNotify.js');
const lifespanInitialisingAll = require('./routes/C_Lifespan_initialising.js');
const vehicleProfiles = require('./routes/vehicleProfiles.js');


const survey_data =require('./routes/Survey_data.js');
const redirectRouter = require('./routes/redirect');

dotenv.config();
const app = express();

connectDB().then(() => {
  app.use(cors());
  app.use(bodyParser.json({ limit: '200mb' })); // You can adjust the limit as needed
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

  app.use('/spareParts', sparePartsRouter);
  app.use('/busModels', busModelsRouter);
  app.use('/addToCart', addToCartRouter);
  app.use('/orders', ordersRouter);
  app.use('/categories', categoriesRouter);
  app.use('/proceedToCheckout', proceedToCheckout);
  app.use('/billingDetails', billingDetails);
  app.use('/shippingDetails', shippingDetails);
  app.use('/purchase', purchase);
  app.use('/surveyQuestions', surveyQuestions);
  app.use('/notifications', notifications);
  app.use('/lifespanInitialisingAll', lifespanInitialisingAll);
  app.use('/vehicleProfiles',vehicleProfiles);
 
  

  app.use('/survey_data',survey_data);
  app.use('/api/redirect', redirectRouter);

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Middleware to parse JSON bodies
app.use(express.json({ limit: '400mb' }));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ limit: '400mb', extended: true }));

  

  app.get('/redirect', (req, res) => {
    res.redirect('http://localhost:3001/');
  });

  const PORT = process.env.PORT || 3001;

  // Using setInterval to run the job every second
  setInterval(async () => {
    try {
      const currentTime = moment().tz('Asia/Colombo').format();
      console.log('Cron job started at', currentTime);
  
      const now = moment().tz('Asia/Colombo').utc().format(); // Convert to UTC format
      console.log('now', now);
  
      // Query for lifespans where expiration notification date or next survey date has passed and not notified
      const lifespans = await CoolingSystemLifespan.find({
        $or: [
          { expirationNotificationDate: { $lte: new Date(now) } },
          { nextSurveyDate: { $lte: new Date(now) } }
        ],
        notified: false // Check only entries that have not been notified
      });
  
      console.log(`Found ${lifespans.length} Lifespans for today's notifications`, lifespans);
  
      for (let lifespan of lifespans) {
        const expirationDate = lifespan.expirationNotificationDate;
        const surveyDate = lifespan.nextSurveyDate;
  
        // Logging to debug
        console.log('expirationDate', expirationDate);
        console.log('now', now);
        console.log('surveyDate', surveyDate);
  
        // Create expiration notification if expiration date has passed
        if (expirationDate && expirationDate <= new Date(now)) {
          console.log('Creating expiration notification for categoryId:', lifespan.categoryId);
  
          await Notification.create({
            customerId: lifespan.customerId,
            categoryId: lifespan.categoryId,
            productId: lifespan.productId,
            type: 'Expiration',
            message: `Your product  is nearing its expiration date.`,
            date: new Date(now)
          });

          await Notification.updateOne(
            { customerId: lifespan.customerId, productId: lifespan.productId, type: 'Survey' },
            { $set: { viewed: true } },
            //{ upsert: true } // 
          );
  
          // Mark as notified
          lifespan.notified = true;
          await lifespan.save();
        }
  
      }

      //Interior parts
      const lifespansI = await InteriorSystemLifespan.find({
        $or: [
          { expirationNotificationDate: { $lte: new Date(now) } },
          { nextSurveyDate: { $lte: new Date(now) } }
        ],
        notified: false // Check only entries that have not been notified
      });
  
      console.log(`Found ${lifespansI.length} I_lifespans for today's notifications`);
  
      for (let lifespanI of lifespansI) {
        const expirationDate = lifespanI.expirationNotificationDate;
        const surveyDate = lifespanI.nextSurveyDate;
  
        // Logging to debug
        console.log('expirationDate', expirationDate);
        console.log('now', now);
        console.log('surveyDate', surveyDate);
  
        if (expirationDate && expirationDate <= new Date(now)) {
          console.log('Creating expiration notification for categoryId:', lifespanI.categoryId);
  
          await Notification.create({
            customerId: lifespanI.customerId,
            categoryId: lifespanI.categoryId,
            productId: lifespanI.productId,
            type: 'Expiration',
            message: `Your product ${lifespanI.productId} is nearing its expiration date.`,
            date: new Date(now)
          });

          await Notification.updateOne(
            { customerId: lifespan.customerId, productId: lifespan.productId, type: 'Survey' },
            { $set: { viewed: true } },
            //{ upsert: true } // 
          );
  
  
          // Mark as notified
          lifespanI.notified = true;
          await lifespanI.save();

          
        }
  
        if (surveyDate && surveyDate <= new Date(now)) {
          console.log('Creating survey notification for categoryId:', lifespanI.categoryId);
  
          await Notification.create({
            customerId: lifespanI.customerId,
            categoryId: lifespanI.categoryId,
            productId: lifespanI.productId,
            type: 'Survey',
            message: `It's time to fill out a survey for your product ${lifespanI.productId}.`,
            date: new Date(now)
          });
  
          // Mark as notified
          lifespanI.notified = true;
          await lifespanI.save();
        }
      }

      //Exterior parts
      const lifespansE = await ExteriorSystemLifespan.find({
        $or: [
          { expirationNotificationDate: { $lte: new Date(now) } },
          { nextSurveyDate: { $lte: new Date(now) } }
        ],
        notified: false // Check only entries that have not been notified
      });
  
      console.log(`Found ${lifespansE.length} I_lifespans for today's notifications`);
  
      for (let lifespanE of lifespansE) {
        const expirationDate = lifespanE.expirationNotificationDate;
        const surveyDate = lifespanE.nextSurveyDate;
  
        // Logging to debug
        console.log('expirationDate', expirationDate);
        console.log('now', now);
        console.log('surveyDate', surveyDate);
  
        if (expirationDate && expirationDate <= new Date(now)) {
          console.log('Ereating expiration notification for categoryId:', lifespanE.categoryId);
  
          await Notification.create({
            customerId: lifespanE.customerId,
            categoryId: lifespanE.categoryId,
            productId: lifespanE.productId,
            type: 'Expiration',
            message: `Your product ${lifespanE.productId} is nearing its expiration date.`,
            date: new Date(now)
          });

          await Notification.updateOne(
            { customerId: lifespan.customerId, productId: lifespan.productId, type: 'Survey' },
            { $set: { viewed: true } },
            //{ upsert: true } // 
          );
  
  
          // Mark as notified
          lifespanE.notified = true;
          await lifespanE.save();
        }
  
        if (surveyDate && surveyDate <= new Date(now)) {
          console.log('Creating survey notification for categoryId:', lifespanE.categoryId);
  
          await Notification.create({
            customerId: lifespanE.customerId,
            categoryId: lifespanE.categoryId,
            productId: lifespanE.productId,
            type: 'Survey',
            message: `It's time to fill out a survey for your product ${lifespanE.productId}.`,
            date: new Date(now)
          });
  
          // Mark as notified
          lifespanE.notified = true;
          await lifespanE.save();
        }
      }

      //Mechancial parts
      const lifespansM = await MechanicalSystemLifespan.find({
        $or: [
          { expirationNotificationDate: { $lte: new Date(now) } },
          { nextSurveyDate: { $lte: new Date(now) } }
        ],
        notified: false // Check only entries that have not been notified
      });
  
      console.log(`Found ${lifespansM.length} M_lifespans for today's notifications`);
  
      for (let lifespanM of lifespansM) {
        const expirationDate = lifespanM.expirationNotificationDate;
        const surveyDate = lifespanM.nextSurveyDate;
  
        // Logging to debug
        console.log('expirationDate', expirationDate);
        console.log('now', now);
        console.log('surveyDate', surveyDate);
  
        if (expirationDate && expirationDate <= new Date(now)) {
          console.log('Creating expiration notification for categoryId:', lifespanM.categoryId);
  
          await Notification.create({
            customerId: lifespanM.customerId,
            categoryId: lifespanM.categoryId,
            productId: lifespanM.productId,
            type: 'Expiration',
            message: `Your product ${lifespanM.productId} is nearing its expiration date.`,
            date: new Date(now)
          });

          await Notification.updateOne(
            { customerId: lifespan.customerId, productId: lifespan.productId, type: 'Survey' },
            { $set: { viewed: true } },
            //{ upsert: true } // 
          );
  
  
          // Mark as notified
          lifespanM.notified = true;
          await lifespanM.save();
        }
  
        if (surveyDate && surveyDate <= new Date(now)) {
          console.log('Creating survey notification for categoryId:', lifespanM.categoryId);
  
          await Notification.create({
            customerId: lifespanM.customerId,
            categoryId: lifespanM.categoryId,
            productId: lifespanM.productId,
            type: 'Survey',
            message: `It's time to fill out a survey for your product ${lifespanM.productId}.`,
            date: new Date(now)
          });
  
          // Mark as notified
          lifespanM.notified = true;
          await lifespanM.save();
        }
      }
  
      console.log('Cron job completed successfully');
    } catch (error) {
      console.error('Error running cron job:', error);
    }
  }, 1000); // Interval set to 1000 milliseconds (1 second)


  
  
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1); // Exit the process if unable to connect to MongoDB
});
