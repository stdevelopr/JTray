import React, { Suspense } from "react";
import LandingPage from "./LandingPage.jsx";
import styles from "./App.module.scss";
import { getToken } from "./auth";

const MainApp = React.lazy(() =>
  import(/* webpackChunkName: "conn" */ "./ConnectWrapper.jsx")
);

const App = () => {
  const token = getToken();
  return (
    <div className={styles.app}>
      <div className={styles.board}>
        {token != "undefined" && token != null ? (
          <Suspense fallback={<div>Loading...</div>}>
            <MainApp token={token} />
          </Suspense>
        ) : (
          <LandingPage />
        )}
      </div>
    </div>
  );
};

export default App;
