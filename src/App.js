import { useEffect } from 'react'
import './App.css'

function App() {

  useEffect(() => {
    const allCells = document.querySelectorAll('td')
    let allEnteredValues = 0
    for (let i = 0; i < 81; i++) {
      if (allCells[i].innerHTML !== '') allEnteredValues++
    }
    const solveButton = document.querySelectorAll('button')[0]
    if (allEnteredValues > 21) {
      solveButton.removeAttribute('disabled')
    } else {
      solveButton.setAttribute('disabled', true)
    }

    fetch('https://en.wiktionary.org/wiki/Lewandowsky#English', {})
      .then (response => console.log(response))

  }, [])

  const findSquare = (i, rowNumber, grid) => {
    let currentSquare
    if (rowNumber < 4) {
      if (i % 9 < 3) {
        currentSquare = [grid.slice(0, 3), grid.slice(9, 12), grid.slice(18, 21)].flat()
      }
      if (i % 9 > 2 && i % 9 < 6) {
        currentSquare = [grid.slice(3, 6), grid.slice(12, 15), grid.slice(21, 24)].flat()
      }
      if (i % 9 > 5) {
        currentSquare = [grid.slice(6, 9), grid.slice(15, 18), grid.slice(24, 27)].flat()
      }
    }
    if (rowNumber > 3 && rowNumber < 7) {
      if (i % 9 < 3) {
        currentSquare = [grid.slice(27, 30), grid.slice(36, 39), grid.slice(45, 48)].flat()
      }
      if (i % 9 > 2 && i % 9 < 6) {
        currentSquare = [grid.slice(30, 33), grid.slice(39, 42), grid.slice(48, 51)].flat()
      }
      if (i % 9 > 5) {
        currentSquare = [grid.slice(33, 36), grid.slice(42, 45), grid.slice(51, 54)].flat()
      }
    }
    if (rowNumber > 6) {
      if (i % 9 < 3) {
        currentSquare = [grid.slice(54, 57), grid.slice(63, 66), grid.slice(72, 75)].flat()
      }
      if (i % 9 > 2 && i % 9 < 6) {
        currentSquare = [grid.slice(57, 60), grid.slice(66, 69), grid.slice(75, 78)].flat()
      }
      if (i % 9 > 5) {
        currentSquare = [grid.slice(60, 63), grid.slice(69, 72), grid.slice(78, 81)].flat()
      }
    }
    return currentSquare
  }

  const solutionStep1 = (grid) => {
    //console.log('step 1 input', grid)
    let newValueFound = false
    let foundValues = {
      '0': '',
      '1': '',
      '2': '',
      '3': '',
      '4': '',
      '5': '',
      '6': '',
      '7': '',
      '8': '',
      '9': '',
      '10': '',
      '11': '',
      '12': '',
      '13': '',
      '14': '',
      '15': '',
      '16': '',
      '17': '',
      '18': '',
      '19': '',
      '20': '',
      '21': '',
      '22': '',
      '23': '',
      '24': '',
      '25': '',
      '26': '',
      '27': '',
      '28': '',
      '29': '',
      '30': '',
      '31': '',
      '32': '',
      '33': '',
      '34': '',
      '35': '',
      '36': '',
      '37': '',
      '38': '',
      '39': '',
      '40': '',
      '41': '',
      '42': '',
      '43': '',
      '44': '',
      '45': '',
      '46': '',
      '47': '',
      '48': '',
      '49': '',
      '50': '',
      '51': '',
      '52': '',
      '53': '',
      '54': '',
      '55': '',
      '56': '',
      '57': '',
      '58': '',
      '59': '',
      '60': '',
      '61': '',
      '62': '',
      '63': '',
      '64': '',
      '65': '',
      '66': '',
      '67': '',
      '68': '',
      '69': '',
      '70': '',
      '71': '',
      '72': '',
      '73': '',
      '74': '',
      '75': '',
      '76': '',
      '77': '',
      '78': '',
      '79': '',
      '80': '',
    }
    for (let i = 0; i < 81; i++) {
      const currentValue = grid[i]
      const allowedValues = []
      if (currentValue === 0) {
        let rowNumber = ((i - (i % 9)) / 9) + 1
        let currentRow = grid.slice((rowNumber * 9) - 9, rowNumber * 9)

        let currentColumn = []

        for (let j = 0; j < 9; j++) currentColumn.push(grid[(9 * j) + (i % 9)])

        let currentSquare = findSquare(i, rowNumber, grid)

        for (let j = 1; j < 10; j++) {
          if (!currentRow.includes(j) && !currentColumn.includes(j) && !currentSquare.includes(j)) {
            allowedValues.push(j)
          }
        }
        foundValues[i] = allowedValues
        if (allowedValues.length === 1) {
          //console.log('found value in step 1', allowedValues[0], 'position', i, 'row', rowNumber, 'column', i - (i % 9))
          newValueFound = true
          grid.splice(i, 1, allowedValues[0])
        }
        if (allowedValues.length === 0) {
          foundValues[i] = [-1]
        }
      } else {
        foundValues[i] = [currentValue]
      }
    }
    return {
      grid,
      newValueFound,
      foundValues
    }
  }

  const solutionStep2 = (grid, foundValues) => {
    //console.log('step 2 input grid', grid)
    let newValueFound = false
    for (let i = 0; i < 81; i++) {
      if (foundValues[i].length > 1) {
        const numbersArray = Array.from({ length: 81 }, (_, i) => i)
        let rowNumber = ((i - (i % 9)) / 9) + 1
        let currentRow = numbersArray.slice((rowNumber * 9) - 9, rowNumber * 9)
        let currentColumn = []
        for (let j = 0; j < 9; j++) {
          const currentIndex = (9 * j) + (i % 9)
          currentColumn.push(numbersArray[currentIndex])
        }
        let currentSquare = findSquare(i, rowNumber, numbersArray)

        for (let j = 0; j < foundValues[i].length; j++) {
          const allRowNumbers = []
          const allColumnNumbers = []
          const allSquareNumbers = []

          for (let k = 0; k < currentRow.length; k++) {
            if (i !== currentRow[k]) {
              allRowNumbers.push(foundValues[currentRow[k]])
            }
          }
          for (let k = 0; k < currentColumn.length; k++) {
            if (i !== currentColumn[k]) {
              allColumnNumbers.push(foundValues[currentColumn[k]])
            }
          }
          for (let k = 0; k < currentSquare.length; k++) {
            if (i !== currentSquare[k]) {
              allSquareNumbers.push(foundValues[currentSquare[k]])
            }
          }

          if (!allRowNumbers.flat().includes(foundValues[i][j]) || !allColumnNumbers.flat().includes(foundValues[i][j]) || !allSquareNumbers.flat().includes(foundValues[i][j])) {
            let newValue = [foundValues[i][j]]
            //console.log(`found value not contained in row, column or square: ${newValue[0]} (index: ${i}, row ${rowNumber}, column ${(i % 9) + 1}`, )
            newValueFound = true
            grid.splice(i, 1, newValue[0])
            foundValues[i] = newValue
            break
          }
        }
      }
    }
    return {
      grid,
      newValueFound,
      foundValues
    }
  }

  const assumptionFunc = (grid, foundValues) => {
    let finalSolution = []
    //console.log(foundValues)
    //console.log(grid)
    window.sessionStorage.setItem('initialAssumptionGrid', grid)
    for (let i = 0; i < 81; i++) {
      if (foundValues[i].length > 1) {
        let testGrid = Array.from(window.sessionStorage.getItem('initialAssumptionGrid').split(','), (x) => parseInt(x))
        //console.log(testGrid)
        for (let j = 0; j < foundValues[i].length; j++) {
          console.log(`checking value ${foundValues[i][j]} for position ${i}`)
          testGrid[i] = foundValues[i][j]
          let step1Output = solutionStep1(testGrid)

          if (step1Output.newValueFound === true) {
            do {
              step1Output = solutionStep1(step1Output.grid)
            } while (step1Output.newValueFound === true)
          }

          let step2Output = solutionStep2(step1Output.grid, step1Output.foundValues)

          if (step2Output.newValueFound === true) {
            do {
              step1Output = solutionStep1(step2Output.grid)
              if (step1Output.newValueFound === true) {
                do {
                  step1Output = solutionStep1(step1Output.grid)
                } while (step1Output.newValueFound === true)
              }
              step2Output = solutionStep2(step1Output.grid, step1Output.foundValues)
            } while (step2Output.newValueFound === true)
          }

          //console.log('assumption output', step2Output.grid)

          if (step2Output.grid.indexOf(0) === -1) {
            console.log('found valid assumption', foundValues[i][j], 'for position', i)
            finalSolution = step2Output.grid
            break
          }
        }
        if (finalSolution.length > 0 && finalSolution.indexOf(0) === -1) {
          break
        }
      }
    }

    if (finalSolution.length === 0) {
      for (let i = 0; i < 81; i++) {
        if (foundValues[i].length > 1) {
          let testGrid = Array.from(window.sessionStorage.getItem('initialAssumptionGrid').split(','), (x) => parseInt(x))
          //console.log(testGrid)
          for (let j = 0; j < foundValues[i].length; j++) {
            console.log(`checking value ${foundValues[i][j]} for position ${i}`)
            testGrid[i] = foundValues[i][j]
            let step1Output = solutionStep1(testGrid)

            if (step1Output.newValueFound === true) {
              do {
                step1Output = solutionStep1(step1Output.grid)
              } while (step1Output.newValueFound === true)
            }

            let step2Output = solutionStep2(step1Output.grid, step1Output.foundValues)

            if (step2Output.newValueFound === true) {
              do {
                step1Output = solutionStep1(step2Output.grid)
                if (step1Output.newValueFound === true) {
                  do {
                    step1Output = solutionStep1(step1Output.grid)
                  } while (step1Output.newValueFound === true)
                }
                step2Output = solutionStep2(step1Output.grid, step1Output.foundValues)
              } while (step2Output.newValueFound === true)
            }

            console.log('assumption output', step2Output.foundValues)
            // console.log('assumption output', step2Output.grid)

            if (Object.values(step2Output.foundValues).flat().indexOf(-1) === -1) {
              window.sessionStorage.setItem('initialAssumptionLevel2Grid', step2Output.grid)

              // ASSUMPTION LEVEL 2
              for (let k = 0; k < 81; k++) {
                if (step2Output.foundValues[k].length > 1) {
                  let testGridLevel2 = Array.from(window.sessionStorage.getItem('initialAssumptionLevel2Grid').split(','), (x) => parseInt(x))
                  for (let l = 0; l < step2Output.foundValues[k].length; l++) {
                    console.log(`ASSUMPTION LEVEL 2: checking value ${step2Output.foundValues[k][l]} for position ${k}`)
                    testGridLevel2[k] = step2Output.foundValues[k][l]
                    let step1OutputLevel2 = solutionStep1(testGridLevel2)

                    if (step1OutputLevel2.newValueFound === true) {
                      do {
                        step1OutputLevel2 = solutionStep1(step1OutputLevel2.grid)
                      } while (step1OutputLevel2.newValueFound === true)
                    }

                    let step2OutputLevel2 = solutionStep2(step1OutputLevel2.grid, step1OutputLevel2.foundValues)

                    if (step2OutputLevel2.newValueFound === true) {
                      do {
                        step1OutputLevel2 = solutionStep1(step2OutputLevel2.grid)
                        if (step1OutputLevel2.newValueFound === true) {
                          do {
                            step1OutputLevel2 = solutionStep1(step1OutputLevel2.grid)
                          } while (step1OutputLevel2.newValueFound === true)
                        }
                        step2OutputLevel2 = solutionStep2(step1OutputLevel2.grid, step1OutputLevel2.foundValues)
                      } while (step2OutputLevel2.newValueFound === true)
                    }

                    // console.log('ASSUMPTION LEVEL 2 output:', step2OutputLevel2.foundValues)
                    // console.log('ASSUMPTION LEVEL 2 output:', step2OutputLevel2.grid)

                    if (step2OutputLevel2.grid.indexOf(0) === -1) {
                      finalSolution = step2OutputLevel2.grid
                      break
                    }
                  }
                }
              }
            }
          }
          if (finalSolution.length > 0 && finalSolution.indexOf(0) === -1) {
            break
          }
        }
      }
    }

    return finalSolution
  }

  const handleSolve = () => {
    const currentGrid = []
    for (let i = 0; i < 81; i++) {
      const currentCell = document.getElementById(i)
      currentGrid.push(parseInt(currentCell.innerHTML) || 0)
    }
    console.log('currentGrid', currentGrid)

    AIFunction(currentGrid)

    let step1Output = solutionStep1(currentGrid)

    if (step1Output.newValueFound === true) {
      do {
        step1Output = solutionStep1(step1Output.grid)
      } while (step1Output.newValueFound === true)
    }

    let step2Output = solutionStep2(step1Output.grid, step1Output.foundValues)

    if (step2Output.newValueFound === true) {
      do {
        step1Output = solutionStep1(step2Output.grid)
        if (step1Output.newValueFound === true) {
          do {
            step1Output = solutionStep1(step1Output.grid)
          } while (step1Output.newValueFound === true)
        }
        step2Output = solutionStep2(step1Output.grid, step1Output.foundValues)
      } while (step2Output.newValueFound === true)
    }

    let finalSolution

    if (step2Output.grid.indexOf(0) === -1) {
      finalSolution = step2Output.grid
    } else {
      finalSolution = assumptionFunc(step2Output.grid, step2Output.foundValues)
    }

    console.log('final solution', finalSolution)

    if (finalSolution.length > 1 && finalSolution.indexOf(0) === -1) {
      for (let i = 0; i < 81; i++) {
        const currentCell = document.getElementById(i)
        if (currentCell.innerHTML === '' && finalSolution[i] !== 0) {
          currentCell.innerHTML = finalSolution[i]
          currentCell.classList.add('added-solution')
        }
      }
    } else {
      console.log('NO SOLUTION FOUND')
    }
  }

  
  // AI TEST STARTS HERE

  const AIFunction = (testGrid) => {
    console.log('testGrid', testGrid)
    function solveSudoku(input) {
      const grid = parse(input);

      console.log('grid', grid)

      // Each mask stores which digits (bits 1..9) are already used.
      const rows = new Array(9).fill(0);
      const cols = new Array(9).fill(0);
      const boxes = new Array(9).fill(0);
      const empties = [];
      const boxOf = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const v = grid[r][c];
          if (v === 0) { empties.push([r, c]); continue; }
          const bit = 1 << v;
          const b = boxOf(r, c);
          if ((rows[r] | cols[c] | boxes[b]) & bit) return null; // duplicate given
          rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
        }
      }

      // empties[0 .. remaining-1] are the cells still to fill.
      function search(remaining) {
        if (remaining === 0) return true;

        // MRV heuristic: pick the empty cell with the fewest legal candidates.
        let bestIdx = -1, bestMask = 0, bestCount = 10;
        for (let i = 0; i < remaining; i++) {
          const [r, c] = empties[i];
          const mask = ~(rows[r] | cols[c] | boxes[boxOf(r, c)]) & 0x3FE; // bits 1..9
          const count = popcount(mask);
          if (count < bestCount) {
            bestCount = count; bestIdx = i; bestMask = mask;
            if (count <= 1) break; // can't do better than a forced move (or a dead end)
          }
        }
        if (bestCount === 0) return false; // dead end: some cell has no options

        // Move the chosen cell to the end of the active region.
        [empties[bestIdx], empties[remaining - 1]] = [empties[remaining - 1], empties[bestIdx]];
        const [r, c] = empties[remaining - 1];
        const b = boxOf(r, c);

        let mask = bestMask;
        while (mask) {
          const bit = mask & -mask; // lowest set bit
          mask ^= bit;
          rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
          grid[r][c] = 31 - Math.clz32(bit); // bit position = digit
          if (search(remaining - 1)) return true;
          rows[r] ^= bit; cols[c] ^= bit; boxes[b] ^= bit; // undo
        }
        grid[r][c] = 0;
        return false;
      }

      return search(empties.length) ? grid : null;
    }

    function popcount(x) {
      let n = 0;
      while (x) { x &= x - 1; n++; }
      return n;
    }

    function parse(input) {
      if (typeof input === "string") {
        const chars = input.replace(/\s/g, "");
        if (chars.length !== 81) throw new Error("Puzzle string must have 81 cells");
        const g = [];
        for (let r = 0; r < 9; r++) {
          g.push([...chars.slice(r * 9, r * 9 + 9)].map(ch => (ch === "." ? 0 : Number(ch))));
        }
        return g;
      }
      return input.map(row => row.slice()); // copy so the original isn't mutated
    }

    function printGrid(grid) {
      grid.forEach((row, r) => {
        if (r % 3 === 0 && r) console.log("------+-------+------");
        console.log(row.map((v, c) => (c % 3 === 0 && c ? "| " : "") + (v || ".")).join(" "));
      });
    }

    // const testGrid = [0, 6, 0, 7, 0, 9, 0, 1, 0, 4, 0, 0, 0, 2, 0, 0, 0, 6, 0, 0, 7, 6, 0, 1, 3, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 0, 5, 0, 0, 0, 7, 1, 0, 0, 6, 0, 0, 5, 3, 6, 5, 0, 3, 0, 8, 0, 9, 1]

    const puzzle =
      testGrid.slice(0, 9).join('') +
      testGrid.slice(9, 18).join('') +
      testGrid.slice(18, 27).join('') +
      testGrid.slice(27, 36).join('') +
      testGrid.slice(36, 45).join('') +
      testGrid.slice(45, 54).join('') +
      testGrid.slice(54, 63).join('') +
      testGrid.slice(63, 72).join('') +
      testGrid.slice(72, 81).join('');

    console.log("Puzzle:");
    printGrid(parse(puzzle));

    const solution = solveSudoku(puzzle);
    console.log("\nSolution:");
    solution ? printGrid(solution) : console.log("No solution found.");
  }

    // AI TEST ENDS HERE

  const checkNumber = (e) => {
    const enteredValue = e.target.innerHTML
    const numberExpression = /^\d+$/
    if (enteredValue.length > 1 || !numberExpression.test(enteredValue)) {
      e.target.innerHTML = ''
    }

    const allCells = document.querySelectorAll('td')
    let allEnteredValues = 0
    for (let i = 0; i < 81; i++) {
      if (allCells[i].innerHTML !== '') allEnteredValues++
    }

    //console.log(allEnteredValues, 'entered values')

    const solveButton = document.querySelectorAll('button')[0]
    if (allEnteredValues > 21) {
      solveButton.removeAttribute('disabled')
    } else {
      solveButton.setAttribute('disabled', true)
    }
  }

  // const handleFile = async (e) => {
  //   let reader = new FileReader()
  //   reader.readAsDataURL(e.target.files[0])
  //   reader.onload = async () => {
  //     // console.log(atob(reader.result.split(',')[1]))
  //     const extractedFile = atob(reader.result.split(',')[1])
  //     console.log(reader.result)
  //     await fetch('http://localhost:8000/imageTest', {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json; charset=UTF-8'
  //       },
  //       body: JSON.stringify({
  //         img: 'C:/Users/user/Downloads/SUDOKU.jpeg'
  //       })
  //     })
  //       // .then(response => response.json())
  //       .then(response => {
  //         console.log(response)
  //       })
  //   }
  // }

  return (
    <div id="content">
      {/* <table>
        <tbody>
        <tr>
          <td id="0" className="square1" contentEditable >9</td>
          <td id="1" className="square1" contentEditable >1</td>
          <td id="2" className="square1" contentEditable ></td>
          <td id="3" className="square2" contentEditable ></td>
          <td id="4" className="square2" contentEditable ></td>
          <td id="5" className="square2" contentEditable >4</td>
          <td id="6" className="square3" contentEditable ></td>
          <td id="7" className="square3" contentEditable ></td>
          <td id="8" className="square3" contentEditable ></td>
          </tr>
        <tr>          
          <td id="9" className="square1" contentEditable ></td>
          <td id="10" className="square1" contentEditable ></td>
          <td id="11" className="square1" contentEditable >7</td>
          <td id="12" className="square2" contentEditable ></td>
          <td id="13" className="square2" contentEditable ></td>
          <td id="14" className="square2" contentEditable ></td>
          <td id="15" className="square3" contentEditable ></td>
          <td id="16" className="square3" contentEditable ></td>
          <td id="17" className="square3" contentEditable ></td>
          </tr>
        <tr>          
          <td id="18" className="square1" contentEditable >5</td>
          <td id="19" className="square1" contentEditable >3</td>
          <td id="20" className="square1" contentEditable ></td>
          <td id="21" className="square2" contentEditable >7</td>
          <td id="22" className="square2" contentEditable >1</td>
          <td id="23" className="square2" contentEditable ></td>
          <td id="24" className="square3" contentEditable ></td>
          <td id="25" className="square3" contentEditable ></td>
          <td id="26" className="square3" contentEditable ></td>
          </tr>
        <tr>          
          <td id="27" className="square4" contentEditable ></td>
          <td id="28" className="square4" contentEditable ></td>
          <td id="29" className="square4" contentEditable >5</td>
          <td id="30" className="square5" contentEditable ></td>
          <td id="31" className="square5" contentEditable ></td>
          <td id="32" className="square5" contentEditable >9</td>
          <td id="33" className="square6" contentEditable ></td>
          <td id="34" className="square6" contentEditable >8</td>
          <td id="35" className="square6" contentEditable >6</td>
          </tr>
        <tr>          
          <td id="36" className="square4" contentEditable >8</td>
          <td id="37" className="square4" contentEditable ></td>
          <td id="38" className="square4" contentEditable ></td>
          <td id="39" className="square5" contentEditable ></td>
          <td id="40" className="square5" contentEditable >5</td>
          <td id="41" className="square5" contentEditable ></td>
          <td id="42" className="square6" contentEditable ></td>
          <td id="43" className="square6" contentEditable ></td>
          <td id="44" className="square6" contentEditable >7</td>
          </tr>
        <tr>          
          <td id="45" className="square4" contentEditable >6</td>
          <td id="46" className="square4" contentEditable >7</td>
          <td id="47" className="square4" contentEditable ></td>
          <td id="48" className="square5" contentEditable >3</td>
          <td id="49" className="square5" contentEditable ></td>
          <td id="50" className="square5" contentEditable ></td>
          <td id="51" className="square6" contentEditable >5</td>
          <td id="52" className="square6" contentEditable ></td>
          <td id="53" className="square6" contentEditable ></td>
          </tr>
        <tr>          
          <td id="54" className="square7" contentEditable ></td>
          <td id="55" className="square7" contentEditable ></td>
          <td id="56" className="square7" contentEditable ></td>
          <td id="57" className="square8" contentEditable ></td>
          <td id="58" className="square8" contentEditable >8</td>
          <td id="59" className="square8" contentEditable >3</td>
          <td id="60" className="square9" contentEditable ></td>
          <td id="61" className="square9" contentEditable >2</td>
          <td id="62" className="square9" contentEditable >4</td>
          </tr>
        <tr>          
          <td id="63" className="square7" contentEditable ></td>
          <td id="64" className="square7" contentEditable ></td>
          <td id="65" className="square7" contentEditable ></td>
          <td id="66" className="square8" contentEditable ></td>
          <td id="67" className="square8" contentEditable ></td>
          <td id="68" className="square8" contentEditable ></td>
          <td id="69" className="square9" contentEditable >1</td>
          <td id="70" className="square9" contentEditable ></td>
          <td id="71" className="square9" contentEditable ></td>
          </tr>
        <tr>          
          <td id="72" className="square7" contentEditable ></td>
          <td id="73" className="square7" contentEditable ></td>
          <td id="74" className="square7" contentEditable ></td>
          <td id="75" className="square8" contentEditable >4</td>
          <td id="76" className="square8" contentEditable ></td>
          <td id="77" className="square8" contentEditable ></td>
          <td id="78" className="square9" contentEditable ></td>
          <td id="79" className="square9" contentEditable >5</td>
          <td id="80" className="square9" contentEditable >9</td>
          </tr>
        </tbody>
      </table> */}

      {/* IMPOSSIBLE GRID*/}
      {/* <table>
        <tbody>
          <tr>
            <td id="0" className="square1" contenteditable >7</td>
            <td id="1" className="square1" contenteditable ></td>
            <td id="2" className="square1" contenteditable ></td>
            <td id="3" className="square2" contenteditable ></td>
            <td id="4" className="square2" contenteditable ></td>
            <td id="5" className="square2" contenteditable ></td>
            <td id="6" className="square3" contenteditable ></td>
            <td id="7" className="square3" contenteditable ></td>
            <td id="8" className="square3" contenteditable ></td>
          </tr>
          <tr>
            <td id="9" className="square1" contenteditable >2</td>
            <td id="10" className="square1" contenteditable >1</td>
            <td id="11" className="square1" contenteditable ></td>
            <td id="12" className="square2" contenteditable ></td>
            <td id="13" className="square2" contenteditable ></td>
            <td id="14" className="square2" contenteditable ></td>
            <td id="15" className="square3" contenteditable ></td>
            <td id="16" className="square3" contenteditable ></td>
            <td id="17" className="square3" contenteditable ></td>
          </tr>
          <tr>
            <td id="18" className="square1" contenteditable >3</td>
            <td id="19" className="square1" contenteditable >8</td>
            <td id="20" className="square1" contenteditable >6</td>
            <td id="21" className="square2" contenteditable ></td>
            <td id="22" className="square2" contenteditable ></td>
            <td id="23" className="square2" contenteditable ></td>
            <td id="24" className="square3" contenteditable ></td>
            <td id="25" className="square3" contenteditable ></td>
            <td id="26" className="square3" contenteditable ></td>
          </tr>
          <tr>
            <td id="27" className="square4" contenteditable >8</td>
            <td id="28" className="square4" contenteditable >2</td>
            <td id="29" className="square4" contenteditable >1</td>
            <td id="30" className="square5" contenteditable >4</td>
            <td id="31" className="square5" contenteditable ></td>
            <td id="32" className="square5" contenteditable ></td>
            <td id="33" className="square6" contenteditable ></td>
            <td id="34" className="square6" contenteditable ></td>
            <td id="35" className="square6" contenteditable ></td>
          </tr>
          <tr>
            <td id="36" className="square4" contenteditable >9</td>
            <td id="37" className="square4" contenteditable >4</td>
            <td id="38" className="square4" contenteditable >7</td>
            <td id="39" className="square5" contenteditable >8</td>
            <td id="40" className="square5" contenteditable >5</td>
            <td id="41" className="square5" contenteditable ></td>
            <td id="42" className="square6" contenteditable ></td>
            <td id="43" className="square6" contenteditable ></td>
            <td id="44" className="square6" contenteditable ></td>
          </tr>
          <tr>
            <td id="45" className="square4" contenteditable >6</td>
            <td id="46" className="square4" contenteditable >3</td>
            <td id="47" className="square4" contenteditable >5</td>
            <td id="48" className="square5" contenteditable >7</td>
            <td id="49" className="square5" contenteditable >1</td>
            <td id="50" className="square5" contenteditable >9</td>
            <td id="51" className="square6" contenteditable ></td>
            <td id="52" className="square6" contenteditable ></td>
            <td id="53" className="square6" contenteditable ></td>
          </tr>
          <tr>
            <td id="54" className="square7" contenteditable >4</td>
            <td id="55" className="square7" contenteditable >6</td>
            <td id="56" className="square7" contenteditable >3</td>
            <td id="57" className="square8" contenteditable >2</td>
            <td id="58" className="square8" contenteditable >8</td>
            <td id="59" className="square8" contenteditable >1</td>
            <td id="60" className="square9" contenteditable >9</td>
            <td id="61" className="square9" contenteditable ></td>
            <td id="62" className="square9" contenteditable ></td>
          </tr>
          <tr>
            <td id="63" className="square7" contenteditable >1</td>
            <td id="64" className="square7" contenteditable >9</td>
            <td id="65" className="square7" contenteditable >2</td>
            <td id="66" className="square8" contenteditable >5</td>
            <td id="67" className="square8" contenteditable >7</td>
            <td id="68" className="square8" contenteditable >4</td>
            <td id="69" className="square9" contenteditable >8</td>
            <td id="70" className="square9" contenteditable >6</td>
            <td id="71" className="square9" contenteditable ></td>
          </tr>
          <tr>
            <td id="72" className="square7" contenteditable >5</td>
            <td id="73" className="square7" contenteditable >7</td>
            <td id="74" className="square7" contenteditable >8</td>
            <td id="75" className="square8" contenteditable >9</td>
            <td id="76" className="square8" contenteditable >6</td>
            <td id="77" className="square8" contenteditable >3</td>
            <td id="78" className="square9" contenteditable >1</td>
            <td id="79" className="square9" contenteditable >2</td>
            <td id="80" className="square9" contenteditable >4</td>
          </tr>
        </tbody>
      </table> */}

      {/* IMPOSSIBLE GRID #2 */}
      {/* <table>
        <tbody>
          <tr>
            <td id="0" className="square1" contentEditable>8</td>
            <td id="1" className="square1" contentEditable></td>
            <td id="2" className="square1" contentEditable></td>
            <td id="3" className="square2" contentEditable></td>
            <td id="4" className="square2" contentEditable></td>
            <td id="5" className="square2" contentEditable></td>
            <td id="6" className="square3" contentEditable></td>
            <td id="7" className="square3" contentEditable></td>
            <td id="8" className="square3" contentEditable></td>
          </tr>
          <tr>
            <td id="9" className="square1" contentEditable></td>
            <td id="10" className="square1" contentEditable></td>
            <td id="11" className="square1" contentEditable>3</td>
            <td id="12" className="square2" contentEditable>6</td>
            <td id="13" className="square2" contentEditable></td>
            <td id="14" className="square2" contentEditable></td>
            <td id="15" className="square3" contentEditable></td>
            <td id="16" className="square3" contentEditable></td>
            <td id="17" className="square3" contentEditable></td>
          </tr>
          <tr>
            <td id="18" className="square1" contentEditable></td>
            <td id="19" className="square1" contentEditable>7</td>
            <td id="20" className="square1" contentEditable></td>
            <td id="21" className="square2" contentEditable></td>
            <td id="22" className="square2" contentEditable>9</td>
            <td id="23" className="square2" contentEditable></td>
            <td id="24" className="square3" contentEditable>2</td>
            <td id="25" className="square3" contentEditable></td>
            <td id="26" className="square3" contentEditable></td>
          </tr>
          <tr>
            <td id="27" className="square4" contentEditable></td>
            <td id="28" className="square4" contentEditable>5</td>
            <td id="29" className="square4" contentEditable></td>
            <td id="30" className="square5" contentEditable></td>
            <td id="31" className="square5" contentEditable></td>
            <td id="32" className="square5" contentEditable>7</td>
            <td id="33" className="square6" contentEditable></td>
            <td id="34" className="square6" contentEditable></td>
            <td id="35" className="square6" contentEditable></td>
          </tr>
          <tr>
            <td id="36" className="square4" contentEditable></td>
            <td id="37" className="square4" contentEditable></td>
            <td id="38" className="square4" contentEditable></td>
            <td id="39" className="square5" contentEditable></td>
            <td id="40" className="square5" contentEditable>4</td>
            <td id="41" className="square5" contentEditable>5</td>
            <td id="42" className="square6" contentEditable>7</td>
            <td id="43" className="square6" contentEditable></td>
            <td id="44" className="square6" contentEditable></td>
          </tr>
          <tr>
            <td id="45" className="square4" contentEditable></td>
            <td id="46" className="square4" contentEditable></td>
            <td id="47" className="square4" contentEditable></td>
            <td id="48" className="square5" contentEditable>1</td>
            <td id="49" className="square5" contentEditable></td>
            <td id="50" className="square5" contentEditable></td>
            <td id="51" className="square6" contentEditable></td>
            <td id="52" className="square6" contentEditable>3</td>
            <td id="53" className="square6" contentEditable></td>
          </tr>
          <tr>
            <td id="54" className="square7" contentEditable></td>
            <td id="55" className="square7" contentEditable></td>
            <td id="56" className="square7" contentEditable>1</td>
            <td id="57" className="square8" contentEditable></td>
            <td id="58" className="square8" contentEditable></td>
            <td id="59" className="square8" contentEditable></td>
            <td id="60" className="square9" contentEditable></td>
            <td id="61" className="square9" contentEditable>6</td>
            <td id="62" className="square9" contentEditable>8</td>
          </tr>
          <tr>
            <td id="63" className="square7" contentEditable></td>
            <td id="64" className="square7" contentEditable></td>
            <td id="65" className="square7" contentEditable>8</td>
            <td id="66" className="square8" contentEditable>5</td>
            <td id="67" className="square8" contentEditable></td>
            <td id="68" className="square8" contentEditable></td>
            <td id="69" className="square9" contentEditable></td>
            <td id="70" className="square9" contentEditable>1</td>
            <td id="71" className="square9" contentEditable></td>
          </tr>
          <tr>
            <td id="72" className="square7" contentEditable></td>
            <td id="73" className="square7" contentEditable>9</td>
            <td id="74" className="square7" contentEditable></td>
            <td id="75" className="square8" contentEditable></td>
            <td id="76" className="square8" contentEditable></td>
            <td id="77" className="square8" contentEditable></td>
            <td id="78" className="square9" contentEditable>4</td>
            <td id="79" className="square9" contentEditable></td>
            <td id="80" className="square9" contentEditable></td>
          </tr>
        </tbody>
      </table> */}

      {/* IMPOSSIBLE GRID #3 */}
      {/* <table>
        <tbody>
          <tr>
            <td id="0" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="1" className="square1" contentEditable onBlur={(e) => checkNumber(e)}>7</td>
            <td id="2" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="3" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="4" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="5" className="square2" contentEditable onBlur={(e) => checkNumber(e)}>6</td>
            <td id="6" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="7" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="8" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="9" className="square1" contentEditable onBlur={(e) => checkNumber(e)}>9</td>
            <td id="10" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="11" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="12" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="13" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="14" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="15" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="16" className="square3" contentEditable onBlur={(e) => checkNumber(e)}>4</td>
            <td id="17" className="square3" contentEditable onBlur={(e) => checkNumber(e)}>1</td>
          </tr>
          <tr>
            <td id="18" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="19" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="20" className="square1" contentEditable onBlur={(e) => checkNumber(e)}>8</td>
            <td id="21" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="22" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="23" className="square2" contentEditable onBlur={(e) => checkNumber(e)}>9</td>
            <td id="24" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="25" className="square3" contentEditable onBlur={(e) => checkNumber(e)}>5</td>
            <td id="26" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="27" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="28" className="square4" contentEditable onBlur={(e) => checkNumber(e)}>9</td>
            <td id="29" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="30" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="31" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="32" className="square5" contentEditable onBlur={(e) => checkNumber(e)}>7</td>
            <td id="33" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="34" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="35" className="square6" contentEditable onBlur={(e) => checkNumber(e)}>2</td>
          </tr>
          <tr>
            <td id="36" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="37" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="38" className="square4" contentEditable onBlur={(e) => checkNumber(e)}>3</td>
            <td id="39" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="40" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="41" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="42" className="square6" contentEditable onBlur={(e) => checkNumber(e)}>8</td>
            <td id="43" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="44" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="45" className="square4" contentEditable onBlur={(e) => checkNumber(e)}>4</td>
            <td id="46" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="47" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="48" className="square5" contentEditable onBlur={(e) => checkNumber(e)}>8</td>
            <td id="49" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="50" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="51" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="52" className="square6" contentEditable onBlur={(e) => checkNumber(e)}>1</td>
            <td id="53" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="54" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="55" className="square7" contentEditable onBlur={(e) => checkNumber(e)}>8</td>
            <td id="56" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="57" className="square8" contentEditable onBlur={(e) => checkNumber(e)}>3</td>
            <td id="58" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="59" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="60" className="square9" contentEditable onBlur={(e) => checkNumber(e)}>9</td>
            <td id="61" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="62" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="63" className="square7" contentEditable onBlur={(e) => checkNumber(e)}>1</td>
            <td id="64" className="square7" contentEditable onBlur={(e) => checkNumber(e)}>6</td>
            <td id="65" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="66" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="67" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="68" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="69" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="70" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="71" className="square9" contentEditable onBlur={(e) => checkNumber(e)}>7</td>
          </tr>
          <tr>
            <td id="72" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="73" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="74" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="75" className="square8" contentEditable onBlur={(e) => checkNumber(e)}>5</td>
            <td id="76" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="77" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="78" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="79" className="square9" contentEditable onBlur={(e) => checkNumber(e)}>8</td>
            <td id="80" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
        </tbody>
      </table> */}

      {/* EMPTY GRID*/}
      <table>
        <tbody>
          <tr>
            <td id="0" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="1" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="2" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="3" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="4" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="5" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="6" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="7" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="8" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="9" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="10" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="11" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="12" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="13" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="14" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="15" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="16" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="17" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="18" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="19" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="20" className="square1" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="21" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="22" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="23" className="square2" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="24" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="25" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="26" className="square3" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="27" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="28" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="29" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="30" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="31" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="32" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="33" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="34" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="35" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="36" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="37" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="38" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="39" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="40" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="41" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="42" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="43" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="44" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="45" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="46" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="47" className="square4" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="48" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="49" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="50" className="square5" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="51" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="52" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="53" className="square6" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="54" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="55" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="56" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="57" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="58" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="59" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="60" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="61" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="62" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="63" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="64" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="65" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="66" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="67" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="68" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="69" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="70" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="71" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
          <tr>
            <td id="72" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="73" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="74" className="square7" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="75" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="76" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="77" className="square8" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="78" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="79" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
            <td id="80" className="square9" contentEditable onBlur={(e) => checkNumber(e)}></td>
          </tr>
        </tbody>
      </table>
      {/* <input type='file' onChange={(e) => handleFile(e)}/> */}
      <button onClick={handleSolve}>Solve</button>
    </div>
  )
}

export default App;
