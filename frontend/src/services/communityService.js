import { communityAPI } from "../api/axiosInstances";

// QUESTIONS
export const createQuestion = (userId, questionData) =>
  communityAPI.post(`/questions/create?userId=${userId}`, questionData);

export const getQuestion = (id) => communityAPI.get(`/questions/get/${id}`);

export const getAllQuestions = () => communityAPI.get(`/questions/all`);

export const getQuestionsBySubject = (subject) =>
  communityAPI.get(`/questions/subject/${subject}`);

export const getQuestionsByLanguage = (language) =>
  communityAPI.get(`/questions/language/${language}`);

export const deleteQuestion = (userId, role, id) =>
  communityAPI.delete(`/questions/delete/${id}`, {
    params: { userId, role },
  });
export const getQuestionsByUserId = (userId) =>
  communityAPI.get(`/questions/user/${userId}`);

// ANSWERS
export const createAnswer = (userId, answerData) =>
  communityAPI.post(`/answers/create?userId=${userId}`, answerData);
export const getAnswersByUserId = (userId) =>
  communityAPI.get(`/answers/user/${userId}`);
export const getAnswersByQuestionId = (questionId) =>
  communityAPI.get(`/answers/question/${questionId}`);

export const updateAnswer = (userId, role, id, answerData) =>
  communityAPI.put(`/answers/update/${id}`, answerData, {
    params: { userId, role },
  });

export const deleteAnswer = (userId, role, id) =>
  communityAPI.delete(`/answers/delete/${id}`, {
    params: { userId, role },
  });

export const acceptAnswer = (userId, role, id) =>
  communityAPI.put(`/answers/accept/${id}`, null, {
    params: { userId, role },
  });

// VOTES
export const createVote = (userId, role, voteData) =>
  communityAPI.post(`/votes/create?userId=${userId}&role=${role}`, voteData);

export const getVoteCount = (answerId, isUpvote) =>
  communityAPI.get(`/votes/count/${answerId}`, {
    params: { isUpvote },
  });

export const removeVote = (userId, role, answerId) =>
  communityAPI.delete(`/votes/remove/${answerId}`, {
    params: { userId, role },
  });
