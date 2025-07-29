// Mock data - replace with actual API calls
const questions = [
  {
    id: 1,
    title: "How to solve quadratic equations?",
    body: "I'm having trouble understanding how to solve quadratic equations using the formula method. Can someone explain step by step with an example?",
    user: "Student123",
    date: "2023-05-10T14:30:00Z",
    language: "english",
    subject: "Mathematics",
    likes: 8,
    answers: 2,
    isSolved: true,
  },
  // Add more questions as needed
];

const answers = [
  {
    id: 1,
    questionId: 1,
    body: "Here's a step-by-step explanation with an example...",
    user: "MathTeacher",
    date: "2023-05-10T15:45:00Z",
    isAccepted: true,
    likes: 5,
  },
  // Add more answers as needed
];

export const getQuestions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(questions);
    }, 800);
  });
};

export const getQuestionById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const question = questions.find((q) => q.id === parseInt(id));
      resolve(question || null);
    }, 800);
  });
};

export const getAnswersForQuestion = async (questionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const questionAnswers = answers.filter(
        (a) => a.questionId === parseInt(questionId)
      );
      resolve(questionAnswers);
    }, 800);
  });
};

export const postQuestion = async (questionData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newQuestion = {
        ...questionData,
        id: questions.length + 1,
        user: "Current User",
        date: new Date().toISOString(),
        likes: 0,
        answers: 0,
        isSolved: false,
      };
      questions.push(newQuestion);
      resolve(newQuestion);
    }, 1000);
  });
};

export const postAnswer = async (questionId, answerData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        question.answers += 1;
      }

      const newAnswer = {
        ...answerData,
        id: answers.length + 1,
        questionId,
        user: "Current User",
        date: new Date().toISOString(),
        isAccepted: false,
        likes: 0,
      };
      answers.push(newAnswer);
      resolve(newAnswer);
    }, 1000);
  });
};

export const likeQuestion = async (questionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        question.likes += 1;
      }
      resolve(question);
    }, 500);
  });
};
