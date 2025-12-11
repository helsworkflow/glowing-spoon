const redis = require('redis');
const keys = require('./keys');

function fib(n) {
  if (n < 2) return 1;
  return fib(n - 1) + fib(n - 2);
}

async function start() {
  const client = redis.createClient({
    socket: {
      host: keys.redisHost,
      port: keys.redisPort
    }
  });

  const subscriber = client.duplicate();

  client.on("error", (err) => console.error("Redis Client Error", err));
  subscriber.on("error", (err) => console.error("Redis Subscriber Error", err));

  await client.connect();
  await subscriber.connect();

  console.log("Worker connected to Redis!");

  await subscriber.subscribe("insert", async (index) => {
    console.log(`Received index: ${index}`);

    const n = parseInt(index);
    const result = fib(n);

    await client.hSet("values", index, result);
    console.log(`Saved fib(${n}) = ${result}`);
  });
}

start().catch(err => console.error("Worker error:", err));