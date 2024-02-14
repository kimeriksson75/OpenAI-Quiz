import Joi from "joi";

const quizSchema = Joi.array().items(
  Joi.object({
    category: Joi.string().required(),
    question: Joi.string().required(),
    answers: Joi.array().items(Joi.string()).required(),
    correctAnswer: Joi.string().required(),
  })
);

export default quizSchema;
