import React, { useEffect, useState } from "react";
import _ from "lodash";

function Home(props: any) {
  let [store, setStore] = useState<any>({ config: {} });
  let [cmd, setCmd] = useState<String>("ls -ahl");
  const changeInput = (e) => {
    setCmd(e.target.value);
  };
  useEffect(() => {
    console.log("props", props);
    const onUpdate = (e, data) => {
      console.log("onUpdate", e, data, store);
      for (var key in data) {
        console.log("data---", key, data, data[key]);
        let keys = key.split(".");
        if (keys.length === 2) {
          if (store[keys[0]] && typeof store[keys[0]][keys[1]] === "object") {
            store[keys[0]][keys[1]] = _.extend(
              store[keys[0]][keys[1]] instanceof Array ? [] : {},
              store[keys[0]][keys[1]],
              data[key]
            );
          } else {
            store[keys[0]] = store[keys[0]] || {};
            store[keys[0]][keys[1]] = data[key];
          }
        } else {
          store[key] = _.extend({}, store[key], data[key]);
        }
        console.log("setStore", store);
        // setStore(store);
        setStore({ ...store });
      }
    };
    window.ipcRenderer.on("update", onUpdate);
    window.ipcRenderer.send("fetch");
    return () => {
      console.log("destory");
      window.ipcRenderer.off("update", onUpdate);
    };
  }, []);
  let onInputChange = (e) => {
    console.log(e.target.value);
  };
  const exec = () => {
    console.log("exec");
    window.ipcRenderer.send("action", {
      type: "exec",
      command: cmd || "ls -ahl",
    });
  };
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        读取数据config.test:
        <input
          defaultValue={store.config.test}
          onChange={onInputChange}
        ></input>
      </div>
      <input onChange={changeInput} defaultValue="ls -ahl"></input>
      <button onClick={exec}>Exec # {cmd}</button>
      {store.config.output && (
        <div>
          output:
          <pre>{store.config.output}</pre>
        </div>
      )}
    </div>
  );
}

export default Home;
