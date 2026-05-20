import React, { Suspense } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import "./index.less";
import Config from "@/pages/config";
// import Form1 from "@/pages/form_1";
import Form2 from "@/pages/form_2";

const Form1 = React.lazy(() => import("@/pages/form_1"));
const MyEditor = React.lazy(() => import("@/pages/editor"));
const NumberScrollPage = React.lazy(() => import("@/pages/numberscroll"));
const ApiPage = React.lazy(() => import("@/pages/api"));
const TodoList = React.lazy(() => import("@/pages/todo"));
const ComponentPage = React.lazy(() => import("@/pages/component"));
// const Config = React.lazy(() => import("@/pages/config"));

const componentMap = {
  Editor: MyEditor,
  NumberScroll: NumberScrollPage,
  Config: Config,
  API: ApiPage,
  Component: ComponentPage,
  Form_1: Form1,
  Form_2: Form2,
  ToDoList: TodoList,
};

const Main = (props) => {
  const { active } = props;
  const renderTransitionComponent = (key, Component) => {
    return (
      <CSSTransition key={key} timeout={300} classNames="fade">
        <div className="content">
          <Suspense fallback={<div>Loading...</div>}>
            <Component />
          </Suspense>
        </div>
      </CSSTransition>
    );
  };

  const renderContent = (key) => {
    if (!key) return <>empty content</>;
    const Component = componentMap[key];
    return Component ? (
      renderTransitionComponent(key, Component)
    ) : (
      <>invalid content</>
    );
  };

  return (
    <div className="main">
      <TransitionGroup component={null}>
        {renderContent(active)}
      </TransitionGroup>
    </div>
  );
};

export default Main;
