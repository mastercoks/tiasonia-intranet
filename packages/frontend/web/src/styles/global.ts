import { shade } from 'polished'
import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
    text-decoration: auto;
  }
  body {
    background-color: ${props => props.theme.colors.light};
    color: ${props => props.theme.colors.lightContrast};
    -webkit-font-smoothing: antialised;
  }
  body, input, textarea {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
  }
  button {
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
  }
  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }
  a, button {
    cursor: pointer;
  }
  @media (max-width: 425px) {
    .hide-sm-down {
      display: none;
    }
  }
  @media (max-width: 768px) {
    .hide-md-down {
      display: none !important;
    }
  }
  @media (min-width: 769px) {
    .hide-md-up {
      display: none !important;
    }
  }
  @media (max-width: 1024px) {
    .hide-lg-down {
      display: none !important;
    }
  }
  @media (min-width: 1025px) {
    .hide-lg-up {
      display: none !important;
    }
  }
  .simplebar-content-wrapper {
    height: 100% !important;
  }

  .rotate {
		animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
		from {
				transform: rotate(0deg);
		}
		to {
				transform: rotate(-359deg);
		}
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    box-shadow: 0 0 0 30px ${props =>
      shade(0.1, props.theme.colors.light)}  inset !important;
  }
`
