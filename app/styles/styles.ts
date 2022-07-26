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
    default:
      return "#9CA3AF";
  }
};

const getPieceColor = (color: any) => {
  switch (color) {
    case "red":
      return "#EB2F51";
    default:
      return "#9CA3AF";
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

const flip = (c: any, pieceColor: any) => keyframes`
  0% {
    transform: rotateX(0deg);
    border-color: #787C7E;
  }

  45% {
    transform: rotateX(90deg);
    border-color: #787C7E;
  }

  55% {
    transform: rotateX(90deg);
    background: ${c === "#9CA3AF" && pieceColor === "#EB2F51" ? "#EB2F51" : c};

    background-image: ${
      c === "#FBBF23" && pieceColor === "#EB2F51"
        ? "-webkit-linear-gradient(45deg, #FBBF23 50%, #EB2F51 50%);"
        : "none"
    };
  
    border: none;

    color: #fff;
  }

  100% {
    transform: rotateX(0deg);

    background: ${c === "#9CA3AF" && pieceColor === "#EB2F51" ? "#EB2F51" : c};

    background-image: ${
      c === "#FBBF23" && pieceColor === "#EB2F51"
        ? "-webkit-linear-gradient(45deg, #FBBF23 50%, #EB2F51 50%);"
        : "none"
    };
  
    border: none;

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
  flipTile?: boolean;
  color?: string;
  pieceColor?: string;
  current?: boolean;
  animationIndex?: number;
  tutorial?: boolean;
}

export const Tile = styled.div<TileProps>`
  width: ${(props) => (props.tutorial ? "60px" : "107px")};
  height: ${(props) => (props.tutorial ? "60px" : "107px")};
  line-height: ${(props) => (props.tutorial ? "60px" : "107px")};

  display: block;
  border: 2px solid #d3d6da;

  justify-content: center;
  align-content: center;

  text-align: center;
  font-weight: bold;
  font-size: ${(props) => (props.tutorial ? "1rem" : "1.5rem")};
  user-select: none;
  box-sizing: border-box;

  border-color: #787c7e;
  animation: ${flip} 0.5s ease forwards;

  @media (max-width: 580px) {
    width: 70px;
    height: 70px;
    line-height: 70px;

    font-size: 1rem;
  }

  @media (max-width: 450px) {
    width: 55px;
    height: 55px;
    line-height: 55px;

    font-size: 0.9rem;
  }

  animation: ${({ flipTile, color, pieceColor, current }: any) =>
    flipTile
      ? css`
          ${flip(
            getTileColor(color),
            getPieceColor(pieceColor)
          )} 0.5s ease forwards
        `
      : current
      ? css`
          ${bounce} 0.2s ease-in-out forwards
        `
      : "none"};

  animation-delay: ${({ animationIndex }: any) =>
    getAnimationDelay(animationIndex)};
`;
