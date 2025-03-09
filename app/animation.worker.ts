let dots: Dot[] = [];
let width = 0;
let height = 0;
let mouse = { x: 0, y: 0 };
const connectionRadius = 150;

export interface Dot {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

export interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

self.onmessage = function(e) {
  const { type } = e.data;

  switch (type) {
    case 'init':
      width = e.data.width;
      height = e.data.height;
      initializeDots(e.data.numDots);
      break;

    case 'mouseMove':
      mouse.x = e.data.x;
      mouse.y = e.data.y;
      break;

    case 'click':
      handleClick(e.data.x, e.data.y);
      break;

    case 'animate':
      const { updatedDots, connections } = updatePositions();
      self.postMessage({ dots: updatedDots, connections });
      break;
  }
};

function initializeDots(numDots: number) {
  dots = [];
  for (let i = 0; i < numDots; i++) {
    dots.push({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      radius: Math.floor(Math.random() * 3) + 1
    });
  }
}

function handleClick(x: number, y: number) {
  const num = 3;
  for (let i = 0; i < num; i++) {
    if (dots.length > 0) {
      const rand = Math.floor(Math.random() * dots.length);
      dots.splice(rand, 1);
    }
  }

  for (let i = 0; i < num; i++) {
    dots.push({
      x: x + (Math.random() - 0.5),
      y: y + (Math.random() - 0.5),
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      radius: Math.floor(Math.random() * 3) + 1
    });
  }
}

function updatePositions() {
  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];

    // Update position
    if (dot.x < 0 || dot.x > width) dot.dx = -dot.dx;
    if (dot.y < 0 || dot.y > height) dot.dy = -dot.dy;
    dot.x += dot.dx;
    dot.y += dot.dy;

    // Mouse repulsion
    let dx = dot.x - mouse.x;
    let dy = dot.y - mouse.y;
    let distanceToMouse = Math.sqrt(dx * dx + dy * dy);

    let radius = 120;
    if (distanceToMouse < radius) {
      let repulse = Math.min(
        Math.max(80 * (-1 * Math.pow(distanceToMouse / radius, 2) + 1), 0),
        40
      );
      dot.x += (dx / distanceToMouse) * repulse;
      dot.y += (dy / distanceToMouse) * repulse;

      // Constrain dots to canvas
      dot.x = Math.max(0, Math.min(dot.x, width));
      dot.y = Math.max(0, Math.min(dot.y, height));
    }
  }

  // Calculate connections
  const connections: Connection[] = [];

  // Use spatial partitioning for efficiency - Claude 3.7 Sonnet gave me this idea
  const cellSize = connectionRadius;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const grid: number[][][] = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => [])
  );

  // Place dots in grid
  dots.forEach((dot, index) => {
    const cellX = Math.floor(dot.x / cellSize);
    const cellY = Math.floor(dot.y / cellSize);

    if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
      grid[cellX][cellY].push(index);
    }
  });

  // Check connections only in neighboring cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cell = grid[i][j];

      // For each dot in the current cell
      cell.forEach(dotIndex => {
        const dot1 = dots[dotIndex];

        // Check connections with other dots in same cell
        cell.forEach(otherIndex => {
          if (dotIndex < otherIndex) {  // avoid duplicate checks
            checkConnection(dot1, dots[otherIndex], connections);
          }
        });

        // Check with neighboring cells
        for (let ni = Math.max(0, i-1); ni <= Math.min(cols-1, i+1); ni++) {
          for (let nj = Math.max(0, j-1); nj <= Math.min(rows-1, j+1); nj++) {
            // Skip current cell as we already processed it
            if (ni === i && nj === j) continue;

            grid[ni][nj].forEach(neighborIndex => {
              checkConnection(dot1, dots[neighborIndex], connections);
            });
          }
        }
      });
    }
  }

  return {
    updatedDots: dots.map(d => ({
      x: d.x,
      y: d.y,
      radius: d.radius
    })),
    connections
  };
}

function checkConnection(dot1: Dot, dot2: Dot, connections: Connection[]) {
  const dx = dot1.x - dot2.x;
  const dy = dot1.y - dot2.y;
  const distSquared = dx * dx + dy * dy;

  if (distSquared < connectionRadius * connectionRadius) {
    const dist = Math.sqrt(distSquared);
    const opacity = Math.min(0.3, 0.3 - dist / (1 / 0.3) / connectionRadius);

    if (opacity > 0.05) {
      connections.push({
        x1: dot1.x,
        y1: dot1.y,
        x2: dot2.x,
        y2: dot2.y,
        opacity
      });
    }
  }
}