import "./LoadingSpinner.css";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

/**
 * Loading Spinner component
 * @returns JSX.Element
 */
const LoadingSpinner = (): JSX.Element => (
  <Spin
    className="spin-center"
    size="large"
    indicator={<LoadingOutlined style={{ fontSize: 180 }} />}
  />
);

export default LoadingSpinner;
