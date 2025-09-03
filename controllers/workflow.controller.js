import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const reminders = [
  { label: "7 days before reminder", daysBefore: 7 },
  { label: "5 days before reminder", daysBefore: 5 },
  { label: "2 days before reminder", daysBefore: 2 },
  { label: "1 day before reminder", daysBefore: 1 },
  { label: "Final day reminder", daysBefore: 0 },
];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  
  const subscription = await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });

  if (!subscription) {
    console.error("Subscription not found");
    return;
  }
 
  if (subscription.status !== "active") {
    console.log(
      `Subscription "${subscription.name}" is not active. Stopping workflow.`
    );
    return;
  }

  const result = await context.run("check renewal date", async () => {
    const renewalDate = dayjs(subscription.renewalDate);
    const now = dayjs();

    const shouldStop = renewalDate.isBefore(now, "day");

    return {
      shouldStop,
      renewalDate: renewalDate.toISOString(),
      now: now.toISOString(),
    };
  });

  if (result.shouldStop) {
    console.log(
      `Renewal date of ${subscription.name} is in the past. Stopping workflow.`
    );
    return;
  }

  const renewalDate = dayjs(result.renewalDate);
  let now = dayjs(result.now);

  for (const reminder of reminders) {
    const reminderDate = renewalDate.subtract(reminder.daysBefore, "day");

    if (now.isBefore(reminderDate)) {
      console.log(
        `Sleeping until next reminder: ${
          reminder.label
        } on ${reminderDate.toISOString()}`
      );

      await context.sleepUntil(reminder.label, reminderDate.toDate());
      now = dayjs(); // Update current time after waking up
    }

    if (now.isSame(reminderDate, "day")) {
      console.log(`Sending ${reminder.label} email.`);

      await context.run(reminder.label, async () => {
        console.log(`${reminder.label} triggered at ${dayjs().toISOString()}`);

        await sendReminderEmail({
          to: subscription.user.email,
          type: reminder.label,
          subscription,
        });
      });

      // If it's the final day reminder, stop the workflow
      if (reminder.daysBefore === 0) {
        console.log("Final day reached. Stopping workflow.");
        return;
      }
    }
  }
});














//previous code 


// import dayjs from 'dayjs'
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)
// const { serve } = require('@upstash/workflow/express')

// import Subscription from '../models/subscription.model.js'

// const REMINDERS = [7,5,2,1]

// export const sendReminders = serve(async(context)=>{
//     const { subscriptionId } = context.requestPayload
//     const subscription = await fetchSubscription(context,subscriptionId)

//     //Below code is for when to not send reminder or stop the reminder process
//     if(!subscription && subscription.status!=="active"){
//         return
//     } 

//     const renewalDate = dayjs(subscription.renewalDate)

//     if(renewalDate.isBefore(dayjs())){
//         console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow ! ...`)
//     }

//     //Below code is for when to start send reminder to user and at which interval
//     for(const daysBefore of REMINDERS){
//         const reminderDate = renewalDate.subtract(daysBefore,'day')
        
//         if(reminderDate.isAfter(dayjs())){
//             await sleepUntilReminder(context,`Reminder ${daysBefore} days before`,reminderDate)
//         }
//         await triggerReminder(context,`Reminder for ${daysBefore} days before`)
//     }
// })


// const fetchSubscription = async(context,subscriptionId)=>{
//     return await context.run('get subscription',async ()=>{
//         return Subscription.findById(subscriptionId).populate('user','name email')
//     })
// }

// const sleepUntilReminder = async(context,label, date) =>{
//     console.log(`Sleeping until ${label} reminder at ${date}`)
//     await context.sleepUntil(label,date.toDate())
// }

// const triggerReminder = async(context,label)=>{
//     return await context.run(label,()=>{
//         console.log(`Triggering ${label} reminder`)
//     })
// }
