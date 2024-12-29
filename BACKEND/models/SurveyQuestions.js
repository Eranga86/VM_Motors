
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for individual questions
const QuestionSchema = new Schema({
  questionId: { type: String },
  questionType: { type: String, enum: ['multiple-choice'], required: true },
  questionText: { type: String, required: true },
  answers: [
    {
      text: { type: String, required: true },
      value: { type: String, required: true }
    }
  ]
});

// Define the schema for the survey questions
const SurveyQuestionsSchema = new Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  category: {
    type: String,
    required: true
  },
  questions: [QuestionSchema], // Embed the QuestionSchema for storing multiple questions
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

SurveyQuestionsSchema.statics.findByCategoryId = function(CategoryId) {
  return this.find({ categoryId: CategoryId });
};

// Create the SurveyQuestions model
const SurveyQuestions = mongoose.model('SurveyQuestions', SurveyQuestionsSchema);

module.exports = SurveyQuestions;



