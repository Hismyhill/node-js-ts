import config from "@/config";
import { IMailer } from "./interface";
import { mailer as mailtrapMailer } from "./mailtrap-mailer";
import { mailer as ConsoleLogMailer } from "./console-log-mailer";

let mailer: IMailer = mailtrapMailer;

if (config.consoleLogEmails) mailer = ConsoleLogMailer;

export { mailer };
