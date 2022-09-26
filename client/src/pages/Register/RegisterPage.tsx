/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button, Form, Input, notification, Typography } from "antd";
import axios from "axios";
import { ClientResponseError } from "pocketbase/dist/pocketbase.es.mjs";
import { parse, stringify } from "querystring";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { client, loginPath, LoginResponse } from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { sleep } from "../../utils";
import { LocationState } from "../types";

const { Title } = Typography;

export const PREV_PATH_KEY = "prevPath";

type RegisterPageProps = {
  setLoggedIn: (value: boolean) => void;
};

const openNotification = (errorMessage: string) => {
  notification.open({
    message: "Login error",
    description: errorMessage,
  });
};

const defaultFamilies = [
  { name: "Biweekly", sync_interval_days: 14},
  { name: "Monthly", sync_interval_days: 28},
  { name: "Quaterly", sync_interval_days: 91},
  { name: "Yearly", sync_interval_days: 365},
]


// /**
//  * Authorize with Google's oAuth
//  * @param prevPath to remember after login
//  */
// const doLogin = (prevPath = "/") => {
//   const state = stringify({
//     [PREV_PATH_KEY]: prevPath,
//   });

//   const options = {
//     client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
//     redirect_uri: `${process.env.REACT_APP_HOST_URL ?? ""}/login`,
//     response_type: "token",
//     include_granted_scopes: "true",
//     scope:
//       "openid email profile https://www.googleapis.com/auth/contacts.readonly",
//     state,
//   };

//   window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${stringify(
//     options
//   )}`;
// };

/**
 * Login Page
 * @param logingPageProps App's states
 * @returns JSX.Element
 */
const RegisterPage = ({ setLoggedIn }: RegisterPageProps): JSX.Element => {
  const history = useHistory();
  // const location = useLocation<LocationState>();
  // const [beforeLoginPath, setBeforeLoginPath] = useState("/");

  // const checkloginCallback = () => {
  //   // window.location.hash keeps the hash, part so we chop it off with substr
  //   const parsedParams = parse(window.location.hash.substr(1));
  //   window.location.hash = "";
  //   if ("error" in parsedParams) {
  //     openNotification(String(parsedParams.error));
  //   } else if ("access_token" in parsedParams) {
  //     const { state } = parsedParams;
  //     if (typeof state === "string" && state.includes(PREV_PATH_KEY)) {
  //       const newPrevPath = parse(state)[PREV_PATH_KEY];
  //       if (typeof newPrevPath === "string") {
  //         setBeforeLoginPath(newPrevPath);
  //       }
  //     }

  //     axios
  //       .post<LoginResponse>(loginPath, parsedParams)
  //       .then((res) => {
  //         if (res.data.isLoggedIn) {
  //           setLoggedIn(true);
  //         } else {
  //           openNotification(JSON.stringify(res.data.error));
  //         }
  //       })
  //       .catch((err) => openNotification(String(err)));
  //   }
  // };

  // useEffect(() => {
  //   checkloginCallback();
  // });

  // Redirect if authentication is done
  // if (loggedIn) {
  //   const replacePath = location.state?.prevPath ?? beforeLoginPath;
  //   history.replace(replacePath);
  //   return <LoadingSpinner />;
  // }
  const register = async (values: any) => {
    try {
      const user = await client.users.create(values);

      await client.users.authViaEmail(values.email, values.password);

      const unassignedFamily = await client.records.create("families", {
        user_id: user.id,
        sync_interval_days: 28,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        name: "Unassigned Mates"
      });

      await client.records.update("profiles", user.profile?.id ?? "", {
        "unassigned_family_id": unassignedFamily.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        "name": values.name
      });

      const defaultFamilyPromises = defaultFamilies.map((family) => 
        client.records.create("families", {
          ...family,
          user_id: user.id
        }, { '$autoCancel': false }) // need to set to false otherwise bulk insert aborts
      );

      await Promise.all(defaultFamilyPromises);

      notification.success({
        message: "Registration Success!",
        description: `email: ${user.email}`
      });
      setLoggedIn(true);
      history.replace("/");
    } catch (err: ClientResponseError | any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      openNotification(JSON.stringify((err as ClientResponseError).data.data));
    }
  }

  return (
    <>
      <Title>Register</Title>
      <Form onFinish={register}>
        <Form.Item
          label="Email"
          name="email"
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          required
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Password Confirm"
          name="passwordConfirm"
          required
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          required
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register!
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default RegisterPage;
