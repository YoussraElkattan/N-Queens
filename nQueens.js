

const readline = require("readline");

function solveDFS(size) {
    if (size < 1) {
        return [];
    }
    const solutions = [];
    const stack = [[]];
    while (stack.length > 0) {
        const solution = stack.pop();
        if (conflict(solution)) {
            continue;
        }
        const row = solution.length;
        if (row === size) {
            solutions.push([...solution]);
            continue;
        }
        for (let col = 0; col < size; col++) {
            const queen = [row, col];
            const queens = [...solution];
            queens.push(queen);
            stack.push(queens);
        }
    }
    return solutions;
}

function conflict(queens) {
    for (let i = 1; i < queens.length; i++) {
        for (let j = 0; j < i; j++) {
            const [a, b] = queens[i];
            const [c, d] = queens[j];
            if (a === c || b === d || Math.abs(a - c) === Math.abs(b - d)) {
                return true;
            }
        }
    }
    return false;
}
function solveBFS(size) {
    if (size < 1) {
        return [];
    }
    const solutions = [];
    const queue = [[]];
    while (queue.length > 0) {
        const solution = queue.shift();
        if (conflict(solution)) {
            continue;
        }
        const row = solution.length;
        if (row === size) {
            solutions.push([...solution]);
            continue;
        }
        for (let col = 0; col < size; col++) {
            const queen = [row, col];
            const queens = [...solution];
            queens.push(queen);
            queue.push(queens);
        }
    }
    return solutions;
}

function solveUCS(size) {
    if (size < 1) {
        return [];
    }
    const solutions = [];
    const queue = [{ queens: [], cost: 0 }];

    while (queue.length > 0) {
        const { queens, cost } = queue.shift();

        if (conflict(queens)) {
            continue;
        }

        const row = queens.length;

        if (row === size) {
            solutions.push([...queens]);
            continue;
        }

        for (let col = 0; col < size; col++) {
            const queen = [row, col];
            const newQueens = [...queens, queen];
            const newCost = cost + 1;
            queue.push({ queens: newQueens, cost: newCost });
        }

       
        queue.sort((a, b) => a.cost - b.cost);
    }

    return solutions;
}
function randomHeuristic() {
    return Math.random();
  }
function solveAStar(size) {
    if (size < 1) {
        return [];
    }
    const solutions = [];
    const openList = [
        { queens: [], cost: 0, heuristic: randomHeuristic() },
    ];
    const closedList = new Set();

    while (openList.length > 0) {
        openList.sort((a, b) => a.cost + a.heuristic - (b.cost + b.heuristic));
        const { queens, cost } = openList.shift();

        if (conflict(queens)) {
            continue;
        }

        const row = queens.length;

        if (row === size) {
            solutions.push([...queens]);
            continue;
        }

        for (let col = 0; col < size; col++) {
            const queen = [row, col];
            const newQueens = [...queens, queen];
            const newCost = cost + 1; 
            const heuristic = randomHeuristic();
            openList.push({ queens: newQueens, cost: newCost, heuristic });
        }

        closedList.add(queens.toString());
    }

    return solutions;
}

function solveGreedy(size) {
    if (size < 1) {
        return [];
    }
    const solutions = [];
    for (let i = 0; i < size; i++) {
        const solution = placeQueensGreedy(size, i);
        if (solution.length === size) {
            solutions.push(solution);
        }
    }
    return solutions;
}

function placeQueensGreedy(size, startRow) {
    const queens = [];
    for (let row = startRow; row < size; row++) {
        let minConflicts = size;
        let minConflictCol = -1;
        for (let col = 0; col < size; col++) {
            const conflictCount = countConflicts(queens, row, col);
            if (conflictCount < minConflicts) {
                minConflicts = conflictCount;
                minConflictCol = col;
            }
        }
        if (minConflictCol !== -1) {
            queens.push([row, minConflictCol]);
        }
    }
    return queens;
}

function countConflicts(queens, row, col) {
    let conflicts = 0;
    for (let i = 0; i < queens.length; i++) {
        const [qRow, qCol] = queens[i];
        if (qCol === col || qRow - qCol === row - col || qRow + qCol === row + col) {
            conflicts++;
        }
    }
    return conflicts;
}


function solveIDDFS(size, conflictFunction) {
    if (size < 1) {
        return [];
    }

    let depth = 0;
    let solutions = [];

    while (solutions.length === 0 && depth <= size) {
        solutions = dfsWithDepthLimit(size, [], depth, conflictFunction);
        depth++;
    }

    return solutions;
}

function dfsWithDepthLimit(size, solution, depthLimit, conflictFunction) {
    const solutions = [];
    const stack = [{ queens: solution, depth: 0 }];

    while (stack.length > 0) {
        const { queens, depth } = stack.pop();

        if (depth > depthLimit) {
            continue;
        }

        if (conflictFunction(queens)) {
            continue;
        }

        const row = queens.length;

        if (row === size) {
            solutions.push([...queens]);
            continue;
        }

        for (let col = 0; col < size; col++) {
            const queen = [row, col];
            const newQueens = [...queens, queen];
            stack.push({ queens: newQueens, depth: depth + 1 });
        }
    }

    return solutions;
}

function conflict(queens) {
  for (let i = 1; i < queens.length; i++) {
    for (let j = 0; j < i; j++) {
      const [a, b] = queens[i];
      const [c, d] = queens[j];
      if (a === c || b === d || Math.abs(a - c) === Math.abs(b - d)) {
        return true;
      }
    }
  }
  return false;
}

function print(queens, size) {
  for (let i = 0; i < size; i++) {
    console.log(" ---".repeat(size));
    for (let j = 0; j < size; j++) {
      const p = queens.some((queen) => queen[0] === i && queen[1] === j)
        ? "Q"
        : " ";
      process.stdout.write(`| ${p} `);
    }
    console.log("|");
  }
  console.log(" ---".repeat(size));
}

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log(".: N-Queens Problem :.");
    rl.question("Please enter the size of the board: ", (inputSize) => {
        const size = parseInt(inputSize);

        const dfsSolutions = solveDFS(size);
        const bfsSolutions = solveBFS(size);
        const ucsSolutions = solveUCS(size);
        const aStarSolutions = solveAStar(size);
        const greedySolutions = solveGreedy(size);
        const iddfsSolutions = solveIDDFS(size, conflict);

        console.log(`Total DFS solutions: ${dfsSolutions.length}`);
        if (dfsSolutions.length > 0) {
            console.log("First DFS solution:");
            print(dfsSolutions[0], size);
        }

        console.log(`Total BFS solutions: ${bfsSolutions.length}`);
        if (bfsSolutions.length > 0) {
            console.log("First BFS solution:");
            print(bfsSolutions[0], size);
        }

        console.log(`Total UCS solutions: ${ucsSolutions.length}`);
        if (ucsSolutions.length > 0) {
            console.log("First UCS solution:");
            print(ucsSolutions[0], size);
        }

        console.log(`Total A* solutions: ${aStarSolutions.length}`);
        if (aStarSolutions.length > 0) {
            console.log("First A* solution:");
            print(aStarSolutions[0], size);
        }

        console.log(`Total Greedy solutions: ${greedySolutions.length}`);
        if (greedySolutions.length > 0) {
            console.log("First Greedy solution:");
            print(greedySolutions[0], size);
        }

        console.log(`Total IDDFS solutions: ${iddfsSolutions.length}`);
        if (iddfsSolutions.length > 0) {
            console.log("First IDDFS solution:");
            print(iddfsSolutions[0], size);
        }

        rl.close();
    });
}

main();
