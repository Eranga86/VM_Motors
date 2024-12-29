function calculateNextSurveyDate(currentDate) {
    // Calculate the next survey date (e.g., one month from the current date)
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return nextDate;
  }
  
  function getBaseLifespanForProduct(productId) {
    // Retrieve base lifespan for the product based on productId
    // This could be a database lookup or a predefined value
    return 24; // Example base lifespan in months
  }
  