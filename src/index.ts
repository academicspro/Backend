import express from "express";
import cors from "cors";
import * as http from "http";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import Logger from "./utils/logger";
// import { CONFIG } from "./config";
import morganMiddleware from "./middlewares/morganMiddleware";
import { getErrorStack } from "./utils/common_utils";
import { sendErrorMessageToSupport } from "./utils/mailer";

import schoolRoute from "./routes/superadmin/schoolRoute";
import superAdminRoute from "./routes/superadmin/superAdminRoute";
import signinRoute from "./routes/signin/signinRoute";
import forgotRoute from "./routes/forgot-password/forgotRoute";
import teacherRoutes from "./routes/admin/schoolauthroutes/teacherRoutes";
import studentRoutes from "./routes/admin/schoolauthroutes/studentRoutes";
// import parentsRoutes from "./routes/admin/schoolauthroutes/parentsRoutes";
import accountRoutes from "./routes/admin/schoolauthroutes/accountRoutes";
import transportRoutes from "./routes/admin/schoolauthroutes/transportRoutes";
import hostelRoutes from "./routes/admin/schoolauthroutes/hostelRoutes";
import assignmentRoute from "./routes/dashboard/teacher/assignmentRoute";
import attendenceRoute from "./routes/dashboard/teacher/attendenceRoute";
import classRoute from "./routes/dashboard/teacher/classRoute";
import examRoute from "./routes/dashboard/teacher/examRoute";
import gradeRoute from "./routes/dashboard/teacher/gradeRoute";
import lessonRoute from "./routes/dashboard/teacher/lessonRoute";
import subjectRoute from "./routes/dashboard/teacher/subjectRoute";
import resultRoute from "./routes/dashboard/teacher/resultRoute";

// import userRoutes from "./routes/superadmin/userRoutes";
import eventRoutes from "./routes/dashboard/admin/eventRoutes";
import annoumcmentRoutes from "./routes/dashboard/admin/annoumcmentRoutes";
import paymentSecreateRoute from "./routes/dashboard/admin/paymentSecreateRoute";
import { errorHandler } from "./middlewares/errorMiddleware";
import { injectUserByToken } from "./utils/jwt_utils";
import getProfileRoute from "./routes/signin/getProfileRoute";
import userRoutes from "./routes/superadmin/userRoutes";
import ticketRoutes from "./routes/dashboard/superadmin/ticketRoutes";
import feebackRoutes from "./routes/dashboard/superadmin/feebackRoutes";
import todoRoutes from "./routes/dashboard/superadmin/todoRoutes";
import answerRoutes from "./routes/dashboard/admin/answerRoutes";
import competitionRoutes from "./routes/dashboard/admin/competitionRoutes";
import leaderboardRoutes from "./routes/dashboard/admin/leaderboardRoutes";
import pyqRoutes from "./routes/dashboard/admin/pyqRoutes";
import transactionRoutes from "./routes/dashboard/admin/transactionRoutes";
import roadmapRoutes from "./routes/dashboard/student/roadmapRoutes";
import topicRoutes from "./routes/dashboard/student/topicRoutes";
import newspaperRoutes from "./routes/dashboard/teacher/newspaperRoutes";
import quizresultRoutes from "./routes/dashboard/teacher/quizresultRoutes";
import quizRoutes from "./routes/dashboard/teacher/quizRoutes";
import doubtRoutes from "./routes/dashboard/admin/doubtRoutes";
import libraryRoutes from "./routes/admin/schoolauthroutes/libraryRoutes";
import bookcopyRoutes from "./routes/dashboard/library/bookcopyRoutes";
import bookIssueRoutes from "./routes/dashboard/library/bookIssueRoutes";
import bookRoutes from "./routes/dashboard/library/bookRoutes";
import createAuthorRoutes from "./routes/dashboard/library/createAuthorRoutes";
import disputeRoutes from "./routes/dashboard/library/disputeRoutes";
import fineManagmentRoutes from "./routes/dashboard/library/fineManagmentRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression({ threshold: 0 }));

// Add the morgan middleware
app.use(morganMiddleware);
app.use(injectUserByToken);

const server = new http.Server(app);

app.get("/", (req, res) => {
  res.send("Backend is live");
});

// Auth Routes
app.use("/api/v1", schoolRoute);
app.use("/api/v1", superAdminRoute);
app.use("/api/v1", signinRoute);
app.use("/api/v1", forgotRoute);
app.use("/api/v1", forgotRoute);
app.use("/api/v1", getProfileRoute);

// School Auth Routes
app.use("/api/v1", teacherRoutes);
app.use("/api/v1", studentRoutes);
// app.use('/api/v1',parentsRoutes);
app.use("/api/v1", accountRoutes);
app.use("/api/v1", transportRoutes);
app.use("/api/v1", hostelRoutes);

// Teacher Routes
app.use("/api/v1", assignmentRoute);
app.use("/api/v1", attendenceRoute);
app.use("/api/v1", classRoute);
app.use("/api/v1", examRoute);
app.use("/api/v1", gradeRoute);
app.use("/api/v1", lessonRoute);
app.use("/api/v1", resultRoute);
app.use("/api/v1", subjectRoute);

// Student Routes

// Parent Routes

// Hostel Routes

// Library Routes

app.use("/api/v1", libraryRoutes);

// Transport Routes

// Admin Routes

app.use("/api/v1", eventRoutes);
app.use("/api/v1", annoumcmentRoutes);
app.use("/api/v1", paymentSecreateRoute);

// Super Admin Routes

app.use("/api/v1", ticketRoutes);
app.use("/api/v1", feebackRoutes);

app.use("/api/v1", userRoutes);
app.use("/api/v1", todoRoutes);

/////////////////////////////////////////////////Routes Need to be Tested //////////////////////////////////////////////////

// admin
app.use("/api/v1", answerRoutes);
app.use("/api/v1", competitionRoutes);
app.use("/api/v1", doubtRoutes);
app.use("/api/v1", leaderboardRoutes);
app.use("/api/v1", pyqRoutes);
app.use("/api/v1", transactionRoutes);

// Teacher

app.use("/api/v1", quizresultRoutes);
app.use("/api/v1", quizRoutes);
app.use("/api/v1", newspaperRoutes);

// Student

app.use("/api/v1", roadmapRoutes);
app.use("/api/v1", topicRoutes);

// Library

app.use("/api/v1", bookcopyRoutes);
app.use("/api/v1", bookIssueRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", createAuthorRoutes);
app.use("/api/v1", disputeRoutes);
app.use("/api/v1", fineManagmentRoutes);


process.on("uncaughtException", function (err) {
  Logger.error(`Error occured: ${getErrorStack(err)}`);

  sendErrorMessageToSupport(getErrorStack(err));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

try {
  server.listen(PORT, (): void => {
    Logger.info(`Connected successfully on port ${PORT}`);
  });
} catch (error) {
  Logger.error(`Error occured: ${error}`);
}
