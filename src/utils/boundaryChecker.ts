export const boundaryChecker = (index: number, tilesCount: number, row: number) => {
    const isTopRow = index < row;
    const isBottomRow = index >= tilesCount - row;
    const isLeftColumn = index % row === 0;
    const isRightColumn = (index + 1) % row === 0;
  
    return isLeftColumn || isRightColumn || isBottomRow || isTopRow;
  };
  