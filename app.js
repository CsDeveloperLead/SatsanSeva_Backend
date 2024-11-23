import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import userRouter from "./routes/user-routes";
import userRouter from "./routes/user-routes.js";
// import adminRouter from "./routes/admin-routes.js";
import eventsRouter from "./routes/events-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";
import {
  getEventsByKM,
  getNearByEvents,
  searchEvents,
  suggestEventNames,
} from "./controllers/event-controller.js";
import { getCount } from "./controllers/booking-controller.js";
import adminRouter from "./routes/admin-routes.js";
import morgan from "morgan";
import nodemailer from "nodemailer";
import { checkUserExists } from "./controllers/user-controller.js";
dotenv.config();
const app = express();

// middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/events", eventsRouter);
app.use("/event/search", searchEvents);
app.use("/event/nearby0", getNearByEvents);
app.use("/event/nearby", getEventsByKM);
app.use("/event/suggestions", suggestEventNames);
app.use("/analytics", getCount);
app.use("/booking", bookingsRouter);

app.get("/checkuser", checkUserExists);


const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "info@satsangseva.com", // GoDaddy email address
    pass: "Satsang@Seva", // Email account password
  },
});

// Route to send email
app.post("/api/send-email", (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  const mailOptions = {
    from: email,
    to: "info@satsangseva.com",
    subject: `Contact Us Message from ${firstName} ${lastName}`,
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Failed to send message. Please try again later.");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Message sent successfully!");
    }
  });
});

app.post("/send-whatsapp", async (req, res) => {
  const { to, message } = req.body;

  try {
    await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${to}`,
      body: message,
    });
    res.status(200).send("WhatsApp message sent successfully.");
  } catch (error) {
    res.status(500).send("Failed to send WhatsApp message.");
  }
});

console.log("MONGODB_URL", process.env.MONGODB_URL);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() =>
    app.listen(process.env.PORT || 8000, () =>
      console.log(
        `Connected To Database And Server is running on port ${
          process.env.PORT || 8000
        }`
      )
    )
  )
  .catch((e) => console.log(e));
