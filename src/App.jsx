import { useState } from "react";
import Aside from "./layout/aside";
import Header from "./layout/header";
import "./App.css";
import Main from "./layout/main";

function App() {
  const [active, setActive] = useState("Config");

  const clickItem = (key) => setActive(key);

  const items = [{ key: "Config" }, { key: "Form_1" }];

  return (
    <div id="app">
      <div className="left_container">
        <Aside>
          {items.map((item) => (
            <div
              key={item.key}
              className={
                active === item.key
                  ? "list_container__item active"
                  : "list_container__item"
              }
              onClick={() => clickItem(item.key)}
            >
              {item.key}
            </div>
          ))}
        </Aside>
      </div>
      <div className="right_container">
        <Header title={active} />
        <Main active={active} />
      </div>
    </div>
  );
}

export default App;
