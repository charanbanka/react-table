import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { columns } from "./components/Columns";
import ReactTable from "./components/React-table";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

import NoPage from "./components/NoPage";
import Layout from "./components/Layout";

const API_URL =
  "https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json";

function App() {
  const [data, setData] = useState([]);
  // const [editData, setEditData] = useState(null);
  const fetchUserData = async () => {
    fetch(API_URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data);
        saveData(data);
      });
  };

  const saveData = async (data) => {
    let is_update = false;
    let resp = await axios.get(`http://localhost:5000/table-data`)
    if(resp.data.status == "success"){
      is_update = resp.data?.data?.is_update || false;
    }
    console.log("is_upade",is_update)
    if (!is_update) {
      axios
        .post(`http://localhost:5000/table-data`, { is_update: false, data })
        .then((res) => {
          console.log(res.data);
        });
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} exact />
          <Route
            path="/react-table"
            element={
              <ReactTable
                defaultPageSize={5}
                columns={columns}
                data={data}
                // editData={editData}
                // setEditData={setEditData}
              />
            }
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
