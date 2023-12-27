import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
    /* Heading */
    @font-face {
      font-family: 'GmarketSansMedium';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    /* Body */
    @font-face {
      font-family: 'SUIT-Regular';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Regular.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }
      `}
  />
);

export default Fonts;
