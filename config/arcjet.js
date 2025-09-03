import arcjet, {shield,detectBot,tokenBucket} from '@arcjet/node'
import { ARCJET_KEY } from './env.js';

const aj = arcjet({

  key: ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      // this will only allow browswer to access , even if you try with postman it will consider it as bot and deny it
      // mode: "LIVE", 
      mode: "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj