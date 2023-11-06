# nodejs

- [ref](https://github.com/redis/node-redis)
- every command is translated to `redisClient.method('parameter1', 'parameter2', ...)`
- some method allow callback to the result

```js
// npm -i redis
const Redis = require("redis");
const redisClient = Redis.createClient();

const DEFAULT_EXPIRATION = 3000;
app.get("/photo", async (req, res) => {
  const ablumID = req.query.albumID;
  redisClient.get("photos", async (error, photos) => {
    if (error) console.log(error);
    if (photo != null) {
      return res.json(JSON.parse(photo));
    } else {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        { params: { albmuID } }
      );
      redisClient.setex("photo", DEFAULT_EXPIRATION, JSON.stringify(data));
      res.json(data);
    }
  });
});
```
