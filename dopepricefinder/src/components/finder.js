import { useState } from "react";

export default function Finder({setTableContent, setDisplayTableContent}) {
    let [lowerBound, setLowerBound] = useState(0);
    let [upperBound, setUpperBound] = useState(0);
      
    //   first attempt was to make it on client's side but i've change my mind to pratice some mongodb

    // async function checkIfClaimed() {
    //     setTableContent(null);
    //     if (lowerBound > upperBound) {
    //         alert("Lower Bound can't be higher than Upper Bound");
    //         return;
    //     } else if (upperBound > 8000 || lowerBound > 8000) {
    //         alert("There is only 8000 $DOPE")
    //         return;
    //     } else if (upperBound < 0 || lowerBound < 0) {
    //         alert("Input can't be negative")
    //         return;
    //     }
    //     let i = Number(lowerBound);
    //     let results = [];
    //     while (true) {
    //         results.push(contractObj.methods.claimedByTokenId(i).call());
    //         if (results.length >= 100 || i === upperBound) {
    //             await Promise.allSettled(results).then((resultsArray) => {
    //                 if (showOnlyUnclaimed) resultsArray = resultsArray.filter(element => element.value !== true);
    //                 let index = i - results.length;
    //                 let output = resultsArray.map((item) => {
    //                     index++;
    //                     return createTableRow(item, index);
    //                 });
    //                 setTableContent((prev) => {
    //                     if (prev) return [...prev, ...output];
    //                     return output;
    //                 });
    //             })
    //             if (i === upperBound) break;
    //             results = [];
    //         }
    //         i++;
    //     }
    // }


    function handleLowerBoundChange(e) {
        let value = Number(e.target.value);
        if (!value || value < 0 || value > 8000) return;
        setLowerBound(value);
    }

    function handleUpperBoundChange(e) {
        let value = Number(e.target.value);
        if (!value || value < 0 || value > 8000) return;
        setUpperBound(value);
    }

    function getLoot(e) {
        fetch(`/api/get?lowerBound=${lowerBound}&upperBound=${upperBound}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                response.sort((a,b) => b.lootid > a.lootid ? -1 : 1)
                setTableContent(response);
                setDisplayTableContent(response);
            })
            .catch(err => console.log(err))
    }

    return (
            <div>
                <div>
                    <span>Lower Bound</span>
                    <input type="text" required value={lowerBound} onChange={handleLowerBoundChange} maxLength="4" />
                </div>
                <div>
                    <span>Upper Bound</span>
                    <input type="text" required value={upperBound} onChange={handleUpperBoundChange} maxLength="4" />
                </div>
                <div id="buttonsContainer">
                    <button onClick={getLoot}>Find</button>
                </div>
            </div>       
    )
}