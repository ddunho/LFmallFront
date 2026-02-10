import { useEffect, useState } from "react";
import api from "../api/axios";

function Example() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/health/db").then(res => {
      console.log(res.data);
      setData(res.data);
    });
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}

export default Example;
