/**
 * Antd uses Moment, which is deprecated
 * https://ant.design/docs/react/replace-moment
 * eslint-disable
 */
import "antd/es/date-picker/style/index";

import generatePicker from "antd/es/date-picker/generatePicker";
import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export default DatePicker;
