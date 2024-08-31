const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Replace these with your email and password
const myemail = 'email';
const mypassword = 'password';

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

function sendMail({ recipient_email, subject, message }) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: myemail,
                pass: mypassword
            }
        });

        const mail_configs = {
            from: myemail,
            to: recipient_email,
            subject: subject,
            text: message,
        };

        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                console.log(error);
                return reject({ message: `An error occurred: ${error.message}` });
            }
            return resolve({ message: "Email sent successfully" });
        });
    });
}

app.post("/send_email", (req, res) => {
    sendMail(req.body)
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
    console.log(`App is running at port: ${port}`);
});
