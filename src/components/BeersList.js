import React from "react";

export function BeerList({ beers }) {
  return (
    <ul>
      {beers.map((beer) => {
        return (
          <li key={beer.id}>
            <div>
              <p>{beer.name}</p>
              <ul>
                <li>
                  <small>ABV: {beer.abv}</small>
                </li>
                <li>
                  <small>
                    Volume: {beer.volume.value} {beer.volume.unit}
                  </small>
                </li>
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
