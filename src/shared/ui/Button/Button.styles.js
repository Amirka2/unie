'use client'

import styled, { css } from 'styled-components';

import { TYPOGRAPHY, getTypographyStyles } from '@shared/lib';
import { Colors } from '@shared/constants';


const BaseDisabledButtonMixin = css`
  cursor: not-allowed;
  text-decoration: none;
  color: ${Colors.Dull};

  &:active,
  &:focus,
  &:hover {
    color: ${Colors.Dull};
  }

  box-shadow: none;
`;

const ButtonVariants = {
  primary: css`
    background-color: ${Colors.FluorescentOrange};

    color: ${Colors.Black};

    &:hover,
    &:active,
    &:focus {
      background-color: ${Colors.FluorescentOrange};
    }

    &:active {
      background-color: ${Colors.OldYella};
    }

    &:disabled {
      ${BaseDisabledButtonMixin};
      background: ${Colors.OldYella};
    }
  `,
  primaryOutlined: css`
    background-color: ${Colors.Transparent};
    border: 2px solid ${Colors.FluorescentOrange};

    &:disabled {
      ${BaseDisabledButtonMixin};
      border: 2px solid ${Colors.Dull};
    }
  `,
  secondary: css`
    background-color: ${Colors.White};
    color: ${Colors.Dull};
    border: 2px solid ${Colors.Dull};

    &:hover,
    &:active,
    &:focus {
      color: ${Colors.Black};
      background-color: ${Colors.White};
    }

    &:disabled {
      ${BaseDisabledButtonMixin};
      border: 2px solid ${Colors.Dull};
    }
  `,
  info: css`
    background-color: ${Colors.StratosBlue};
    border: solid 1px ${Colors.StratosBlue};

    color: ${Colors.White};

    &:hover,
    &:active,
    &:focus {
      background-color: ${Colors.ZimaBlue};
    }

    &:disabled {
      ${BaseDisabledButtonMixin};
      color: ${Colors.White};

      &:active,
      &:focus,
      &:hover {
        color: ${Colors.White};
      }

      background-color: ${Colors.EarlyForgetMeNot};
      border: solid 1px ${Colors.EarlyForgetMeNot};
    }
  `,
  infoOutlined: css`
    background-color: transparent;
    color: ${Colors.StratosBlue};
    border: 2px solid ${Colors.StratosBlue};

    &:hover,
    &:active,
    &:focus {
      background-color: ${Colors.StratosBlue};
      color: ${Colors.White};
    }

    &:disabled {
      ${BaseDisabledButtonMixin};
      border: 2px solid ${Colors.Dull};
    }
  `,
};

const ButtonSizeStyles = {
  small: css`
    ${getTypographyStyles(TYPOGRAPHY.caption3)}

    padding: 8px 16px;
  `,
  medium: css`
    padding: 10px 35px 11px;
  `,
  large: css`
    padding: 15px 45px 16px;
  `,
};

export const LoaderContainer = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  height: 90%;
`;

export const ChildContainer = styled.span`
  ${({ isLoading }) =>
    isLoading &&
    `
    opacity: 0;
  `}
`;

export const StyledButton = styled.button`
  display: block;

  width: auto;
  padding: 0;

  background-color: transparent;
  appearance: none;
  border: none;

  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  ${getTypographyStyles(TYPOGRAPHY.caption1)};

  ${({ variant }) =>
    variant &&
    css`
      border-radius: 3px;

      transition: 0.3s ease-out;

      &:hover,
      &:active,
      &:focus {
        box-shadow:
          0 3px 3px 0 rgb(0 0 0 / 14%),
          0 1px 7px 0 rgb(0 0 0 / 12%),
          0 3px 1px -1px rgb(0 0 0 / 2%);
      }

      ${ButtonVariants[variant]}
    `}

  ${({ size }) => size && ButtonSizeStyles[size]}

  ${({ isRounded }) =>
    isRounded &&
    `
    border-radius: 999px;
  `}

  ${({ isLoading }) =>
    isLoading &&
    `
    position: relative;
  `}

  ${({ isFullWidth }) =>
    isFullWidth &&
    `
    width: 100%;
  `}
`;
