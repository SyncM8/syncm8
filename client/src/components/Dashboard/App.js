/* eslint-disable */
import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_ORDER = gql`
  query getOrderFn {
    orders {
      id
      name
      type
      size
    }
  }
`;

const SUBMIT_ORDER = gql`
  mutation orderFn($size: Size!, $name: String!, $type: CoffeeType!) {
    orderCoffee(size: $size, name: $name, type: $type) {
      id
      name
      type
      size
    }
  }
`;

function App() {
  const {
    loading: getOrderLoading,
    error: getOrderError,
    data: getOrderData,
    refetch: getOrderRefetch,
  } = useQuery(GET_ORDER);
  const [orderFn, { submitLoading, submitError, submitData }] = useMutation(
    SUBMIT_ORDER,
    {
      // onCompleted: () => {
      //   console.log("REFETCHING AFTER SUBMITTING", (submitData || {}).data);
      //   getOrderRefetch();
      // }
      refetchQueries: ["getOrderFn"],
    }
  );

  const myOrders =
    getOrderLoading || getOrderError ? [] : (getOrderData || {}).orders ?? [];

  function onSubmitOrderForm(order) {
    orderFn({
      variables: { size: order.size, name: order.name, type: order.type },
    });
  }

  console.log("my orders", getOrderData, myOrders);

  return (
    <div>
      <header>
        <OrderForm onSubmit={onSubmitOrderForm} />
        {getOrderError &&
          `Getting Order Error ${(getOrderError || {}).message}`}
        <Orders orders={myOrders} />
      </header>
    </div>
  );
}

function OrderForm({ onSubmit }) {
  const [order, setOrder] = useState({
    size: "SMALL",
    type: "FLAT_WHITE",
    name: "",
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(order);
        setOrder({ ...order, name: "" });
      }}
      className="Form"
    >
      <label>
        <span>Size:</span>
        <select
          onChange={({ target }) => setOrder({ ...order, size: target.value })}
        >
          <option value="SMALL" defaultValue>
            Small
          </option>
          <option value="REGULAR">Regular</option>
        </select>
      </label>
      <label>
        <span>Name:</span>
        <input
          value={order.name}
          type="text"
          onChange={({ target }) => setOrder({ ...order, name: target.value })}
        />
      </label>
      <label>
        <span>Type:</span>
        <select
          onChange={({ target }) => setOrder({ ...order, type: target.value })}
        >
          <option value="FLAT_WHITE" defaultValue>
            Flat White
          </option>
          <option value="ESPRESSO">Espresso</option>
        </select>
      </label>
      <input type="submit" disabled={order.name === ""} value="Order Coffee" />
    </form>
  );
}

function Orders({ orders }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.name} - {order.size.toLowerCase()}{" "}
          {order.type.split("_").join(" ").toLowerCase()}
        </li>
      ))}
    </ul>
  );
}

export default App;
