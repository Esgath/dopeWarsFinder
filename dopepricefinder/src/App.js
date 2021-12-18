import { useEffect, useState } from 'react';
import './App.css';
import Finder from './components/finder';

function App() {
  // fetch initial data and store it
  let [tableContent, setTableContent] = useState(null);
  // modifies the data
  let [displayTableContent, setDisplayTableContent] = useState(null);
  let [showOnlyUnclaimed, setShowOnlyUnclaimed] = useState(false);
  let [showOnlyWithPrice, setShowOnlyWithPrice] = useState(false);

  useEffect(() => {
    filterData();
  }, [showOnlyUnclaimed, showOnlyWithPrice, tableContent]);

  function createTableRow(item) {
    return (
      <tr key={item.lootid}>
          <td>{"Gear#" + (Number(item.lootid))}</td>
          <td>{item.claimed ? "claimed" : "unclaimed"}</td>
          <td>{item.rare}</td>
          <td><a href={`https://opensea.io/assets/0x8707276df042e89669d69a177d3da7dc78bd8723/${item.lootid}`}>link</a></td>
          <td>{item.price !== 0 ? item.price : 'no price'}</td>
      </tr>
    );
  }

  function filterData(e) {
    if(tableContent) {
      let data = showOnlyUnclaimed ? tableContent.filter(item => !item.claimed) : tableContent;
      data = showOnlyWithPrice ? data.filter(item => item.price) : data;
      setDisplayTableContent(data);
    }
  }
  
  return (
    <div className="App">
      <div id="formContainer">
        <div>
          Bounds: 1-8000
        </div>
        <Finder setTableContent={setTableContent} setDisplayTableContent={setDisplayTableContent}/>
        <div id="checkboxContainer">
          <div>
            <label>
              <input type="checkbox" checked={showOnlyUnclaimed} onChange={(e) => {
                setShowOnlyUnclaimed(e.target.checked);
              }} />
              Show Only Unclaimed
            </label>
            <label>
              <input type="checkbox" checked={showOnlyWithPrice} onChange={(e) => {
                setShowOnlyWithPrice(e.target.checked);
              }} />
              Show Only With Price
            </label>
          </div>
        </div>
      </div>
      <div id="resultsContainer">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Is claimed?</th>
              <th>Rank</th>
              <th>OpenSea link</th>
              <th>OpenSea price</th>
            </tr>
          </thead>
          <tbody id="dataRowsBody">
            {displayTableContent ?
                displayTableContent.map((item) => {
                  return createTableRow(item);
                }) : null}
          </tbody>
        </table>
      </div>    
    </div>
  );
}

export default App;
