var express = require('express');
var router = express.Router();
var fs = require('fs');
const request = require('request');
var axios = require('axios');

var crypto = require('crypto');

//var Cart = require('../models/cart');
//var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
const { v4: uuidv4 } = require('uuid'); // Import the uuid package

//MARK: onepay payment gateway values 

var paymentUrl = 'https://merchant-api-live-v2.onepay.lk/api/ipg/gateway/request-transaction/?hash='

//MARK: Please access onepay merchant admin panel to get this values 
var appId = 'ULFS1187B491613F9C6C0'
var appToken = '88813da5c9e5fbc9d29137e349ac611f209db60a1e9e9a2ab5b39babf7f1481c8f45c595d1725231.JNMV1187B491613F9C715'
var salt = '3PQL1187B491613F9C6EE'
var transactionRedirectUrl = 'http://localhost:3000/'



//MARK: Payment Route
router.post('/pay', function (req, res, next) {
  const { fname, lname, phonenumber, email,totalprice,userid,orderid,cartItems } = req.body;

  if (!fname || !lname || !phonenumber || !email || !totalprice || !orderid || !userid ) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  const purchaseData = {
    customerId: userid,
    products: cartItems.map(product => ({
      productId: product.productId,
      purchaseDate: new Date(),
      categoryId: product.categoryId
    }))
  };

  

  var data = JSON.stringify({
    "amount": totalprice,  // only allow LKR amounts
    "app_id": appId,
    "reference": "5888995555546656925", // enter unique number
    "customer_first_name": fname,
    "customer_last_name": lname,
    "customer_phone_number": phonenumber, // please enter number with +94
    "customer_email": email,
   // "customer_address": address,
   // "customer_city": city,
   // "customer_state": state,
    //"customer_zip": zip,
    //"customer_country": country,
    "transaction_redirect_url": transactionRedirectUrl
  });

  var hash = crypto.createHash('sha256');
  hash_obj = data + salt; // append salt to the json when making hash obj
  hash_obj = hash.update(hash_obj, 'utf-8');
  gen_hash = hash_obj.digest('hex');

  var options = {
    method: 'get',
    url: paymentUrl + gen_hash,
    headers: {
      'Authorization': appToken,
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(options)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
     // const json_data = JSON.parse(JSON.stringify(response.data));
      if (response.data.status === 1000 && response.data.data.gateway.redirect_url) {
        
        const orderDetails = {
          paymentStatus:"Paid" ,
         
        };
        console.log('Oid :', orderid,userid);
          try {
            const response4 =  axios.put(`http://localhost:3001/orders/order_payment_status_update/${orderid}`,orderDetails);
            console.log('Order details :', response4.data);
            
          } catch (error) {
            console.error('Error fetching products:', error);
          }

          
          try {
             axios.delete(`http://localhost:3001/addToCart/cart_remove_after_purchase/${userid}`);
            console.log('removed purchased orders from the addtocart:');
            
          } catch (error) {
            console.error('Error fetching products:', error);
          }

          try {
            axios.post(`http://localhost:3001/purchase/post`,purchaseData);
          console.log('added products to the purchase table:');
           
         } catch (error) {
          console.error('Error adding products:', error);
        }
     
      
        
        const redirectUrl = response.data.data.gateway.redirect_url;
        res.status(200).json({ redirect_url: redirectUrl }); // Send the redirect URL to frontend
      } else {
        res.status(400).json({ message: "Failed to get redirect URL from payment gateway." });
      }
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});


module.exports = router;
