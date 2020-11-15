import React from "react";
import { connect } from "react-redux";
import { BeerList } from "./BeersList";
import { random, cancel } from "../reducers/beersActions";
import { setConfig } from "../reducers/configActions";

export function Beers({
  data,
  status,
  config,
  messages,
  random,
  cancel,
  setConfig
}) {
  return (
    <>
      <div>
        <select
          name="per-page"
          defaultValue={config.perPage}
          onChange={(event) => {
            setConfig({ perPage: Number(event.target.value) });
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
            return (
              <option key={value} value={value}>
                {value} results
              </option>
            );
          })}
        </select>
        {/* <input
          type="text"
          placeholder="search"
          onChange={(event) => search(event.target.value)}
        /> */}
        <button type="button" onClick={random} disabled={status === "pending"}>
          Random
        </button>
        {status === "pending" && (
          <button type="button" onClick={cancel}>
            Cancel
          </button>
        )}

        {/* <button
          type="button"
          onClick={fetchData}
          disabled={status === "pending"}
        >
          Fetch Beers!
        </button> */}
        {status === "pending" && <p>loading...</p>}
      </div>
      {status === "success" && (
        <div>
          <BeerList beers={data} />
        </div>
      )}
      {status === "failure" && <p>Error {messages[0].text}</p>}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    ...state.beers,
    config: state.config
  };
};

export default connect(mapStateToProps, { random, cancel, setConfig })(Beers);
