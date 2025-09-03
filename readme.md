1) Api also have headers and headers contain special information like meta-data about the request or response like (authentication token, content-type, cache-control, accept,etc)
2) Will use authorization header that will include bearer token for validate the user.
3) Response body: contain data that server send back after processing the request
4) there are also status code


5) REST API: Representational state transfer api
# a most commonly used api
# it follow a structured approach where client interacated with resources using "URLS" and standard http method like "GET","post" , 'put' and 'delete'
# it is stateless which means each request is independent and does not rely on previous request.
# it use json for highly compatible

# graphql is very good at with large dataset and smoothly deal with over-fetching and under-fetching 

THERE ARE FEW ARCHITECTURE THAT MOSTLY FOLLOW ACCORDING TO PROJECT NEEDS

1) Monolithics Architecture
2) Microservices Architecture

####       SUBSCRIPTION TRACKING API - Production Ready PROJECT  #####
@ setting up monolithic architecture backend
@ connecting to a mongoDB Database
@ using nodejs and expressjs
@ securing api with arcjet
@ automating subscription tracking with upstash workflow
@ using postman for checking api
@ We build mongodb schema in such a way that each user will have their own subscriptions (not sharable)
@ We also implemented session based system in mongodb by using "mongoose.startSession()" for better security

#### FEATURES

# Arcjet
@ Implemented API rate limiting to handle multiple concurrent requests, preventing server overload and ensuring protection against DDoS-like attacks.
@ Implemented A Bot protecting system that will prevent from accessing the api
@Rate limiting implementation in API.


@ implemented a complete authorization system
@ implemented authorization header that will include bearer token for validate the user.
@ Auto Calculating renewal date
@ Implemented Good Validation checks

# UpStash
A worklow (like a message queuing or task schduling system)
@ Setting up reminder
@ Email based reminder implement here for subscription , wheather to continue subscription or discontinue the subscription.

################# UPSTASH FLOW ##########################
@ Trigger workflow: whenever user create a new subscription the we pass that subscription id to workflow

@ Retrieving Subscription Details : The process extracts the subscription id from the context and searches the corresponding subscription in the database.

@If the subscription does not exist an error will logged and process terminated.
 If exist then status will checked
    if status is inactive , status will logged an process exits
    if active the renewal date is verfied 

@Renewal date evaluation: 
if renewal date hs passed , it logs this information and exits;
if the renewal date is in the future the reminder loop begin

@Reminder Scheduling
for Each predefined reminder

@Completion
similarly process repeats for all the reminders in the list
After processing all reminder the workflow concludes

# NodeMailer

@ A Module used for sending the email 
@ Already present in npm repository






#### Platform used 
Upstash : Email reminder system
Hostinger VPS : For hosting backend code
Arcjet : bot detection, attack protection, validation, rate limiting, etc
WebStorm :

#### Package Install

express-generator
eslint : for setting up the workspace




