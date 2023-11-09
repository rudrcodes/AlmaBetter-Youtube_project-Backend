const express = require("express");
const app = express();

// * Only Delete op is left
const cors = require("cors");

app.use(cors());
app.use(express.json());

//  Importing Mongoose Schema from subscribers.js
const susbcriberSchema = require("./models/subscribers");

// Creating POST API which let users create new data
app.post("/subscribers/EnterData", async (req, res) => {
  const data = await req.body;
  console.log("data : ", data);
  console.log("Pushing data");

  //pushing data to the DB
  try {
    // const response = await susbcriberSchema.create(data );
    const newUser = await new susbcriberSchema(data);
    const response = await newUser.save();

    console.log("response : ", response);
    res.json({ response });
  } catch (error) {
    console.log(error);
  }
});
// Creating PUT API TO UPDATE USER data BASED ON ID
app.put("/subscribers/UpdateData/:id", async (req, res) => {
  const id = req.params.id;
  const inputData = await req.body;
  const name = inputData.name;
  const subscribedChannel = inputData.subscribedChannel;
  console.log(`Updating user with ${id}`);
  console.log("data : ", inputData);
  let data = {};
  if (name.length != 0) data[name] = name;
  if (subscribedChannel.length != 0)
    data[subscribedChannel] = subscribedChannel;
  //pushing data to the DB
  try {
    // const response = await susbcriberSchema.create(data );
    const updateRes = await susbcriberSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      inputData
    );

    console.log("response : ", updateRes);
    res.json({ updateRes });
  } catch (error) {
    res.json({ err: error });
    console.log(error);
  }
});

// Delete subsriber data based of their id
app.delete("/subscribers/DeleteData", async (req, res) => {
  const { id } = req.body.id;
  console.log(id);
  console.log(`Deleting user with ${id}`);
  try {
    // const response = await susbcriberSchema.create(data );
    const DeleteRes = await susbcriberSchema.deleteOne({
      _id: id,
    });

    console.log("response : ", DeleteRes);
    res.json({ DeleteRes });
  } catch (error) {
    res.json({ err: error });
    console.log(error);
  }
});

// Creating GET API which response with an array of subscribers. (an Object)
app.get("/subscribers", async (req, res) => {
  let data = await susbcriberSchema.find();
  res.send(data);
  console.log("All subs");
});

// Creating GET API response with an array of subscribers with name and subscribed channel only. (an Object)
app.get("/subscribers/names", async (req, res) => {
  let data = await susbcriberSchema.find();
  let result = data.map((item) => {
    return { name: item.name, subscribedChannel: item.subscribedChannel };
  });
  res.send(result);
  console.log("All names");
});

//  Creating GET API response with a subscriber with given id. (an object)
//  and response error with status code 400 if id does not match the format.
app.get("/subscribers/:id", cors(), async (req, res, next) => {
  try {
    const result = await susbcriberSchema.find({ _id: req.params.id });
    console.log("result : ", result);
    if (result.length == 0) {
      res.status(400).json({ err: 'No user found' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ err: error });
  }
  console.log("one sub");

});

// Error Logging
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
