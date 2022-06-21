import styled, { keyframes, css } from "styled-components";

const getAnimationDelay = (index: any) => {
  return index * 0.2 + "s";
};

const getTileColor = (color: any) => {
  switch (color) {
    case "green":
      return "#12B980";
    case "yellow":
      return "#FBBF23";
    case "grey":
      return "#9CA3AF";
    case "blue":
      return "blue";
    default:
      return "#d3d6da";
  }
};

const shake = () => keyframes`
    10%, 90% {
        transform: translate3d(-1px, 0, 0);
    }
  
    20%, 80% {
        transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
        transform: translate3d(4px, 0, 0);
    }
`;

const bounce = () => keyframes`
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
`;

const flip = (c: any) => keyframes`
  0% {
    transform: rotateX(0deg);
    background: #fff;
    border-color: #787C7E;
    color: #000;
  }

  45% {
    transform: rotateX(90deg);
    background: #fff;
    border-color: #787C7E;
    color: #000;
  }

  55% {
    transform: rotateX(90deg);
    background: ${c};
    border-color: ${c};
    color: #fff;
  }

  100% {
    transform: rotateX(0deg);
    background: ${c};
    border-color: ${c};
    color: #fff;
  }
`;

interface StyledRowProps {
  insufficientMoves?: any;
}

export const StyledRow = styled.div<StyledRowProps>`
  text-align: center;
  display: flex;
  justify-content: center;
  animation: ${(props) =>
    props.insufficientMoves
      ? css`
          ${shake} 0.5s ease forwards
        `
      : "none"};
`;

interface TileProps {
  flipTile?: any;
  color?: any;
  current?: any;
  animationIndex?: any;
}

export const Tile = styled.div<TileProps>`
  width: 107px;
  height: 107px;
  line-height: 107px;

  display: block;
  border: 2px solid #d3d6da;

  justify-content: center;
  align-content: center;
  margin: 3px;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
  user-select: none;
  box-sizing: border-box;

  background-color: white;
  border-color: #787c7e;
  animation: ${flip} 0.5s ease forwards;

  @media (max-width: 580px) {
    width: 70px;
    height: 70px;
    line-height: 70px;

    font-size: 1rem;
  }

  @media (max-width: 450px) {
    width: 50px;
    height: 50px;
    line-height: 50px;

    font-size: 0.8rem;
  }

  animation: ${({ flipTile, color, current }: any) =>
    flipTile
      ? css`
          ${flip(getTileColor(color))} 0.5s ease forwards
        `
      : current
      ? css`
          ${bounce} 0.2s ease-in-out forwards
        `
      : "none"};

  animation-delay: ${({ animationIndex }: any) =>
    getAnimationDelay(animationIndex)};
`;
