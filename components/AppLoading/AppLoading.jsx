import { Spinner } from "@shopify/polaris";
import React from "react";
import "./AppLoading.scss";

const AppLoading = ({ loading }) => {
  return loading ? (
    <div className="loading__container">
      <Spinner accessibilityLabel="Spinner example" size="large" />
    </div>
  ) : null;
};

export default AppLoading;
