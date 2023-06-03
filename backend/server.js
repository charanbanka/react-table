import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
let options = {
  origin: "http://localhost:3000",
  "Access-Control-Allow-Origin": "*",
};

app.use(cors(options));
const PORT = 5000;

app.get("/", (req, res) => {
  res.send({ name: "charan" });
});

const getTableData = () => {
  const result = { status: "failure" };
  if (fs.existsSync("table-data.json")) {
    let data = fs.readFileSync("table-data.json");
    result.data = JSON.parse(data);
    result.status = "success";
  } else {
    result.status = "failure";
    result.message = "file not found";
  }
  return result;
};

app.get("/table-data", async (req, res) => {
  try {
    let result = getTableData();
    if (result.status == "success") res.json(result);
    else res.json(result);
  } catch (error) {
    console.log("fetch table data", error);
    res.json({status: "failure", message: error.message });
  }
});

app.post("/table-data", async (req, res) => {
  try {
    const data = JSON.stringify(req.body);

    if (fs.existsSync("table-data.json")) {
      fs.writeFileSync("table-data.json", data);
    } else {
      fs.writeFile("table-data.json", data, function (err) {
        if (err) console.log(err);
      });
    }

    let result = getTableData();
    if (result.status == "success") res.status(200).json(result);
    else res.json(result);
  } catch (error) {
    console.log("save table data", error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
