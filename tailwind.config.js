module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        lower: "0 3px rgb(40, 44, 52)",
      },
      spacing: {
        104: "26rem",
        112: "28rem",
        128: "32rem",
        144: "36rem",
        "30p": "30%",
        "32p": "32%",
        "35p": "35%",
      },
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
      },
      maxWidth: {
        128: "32rem",
        144: "36rem",
      },
      screens: {
        tiny: "576px",
        micro: "512px",
      },
      height: {
        17: "4.25rem",
        112: "28rem",
        128: "32rem",
        144: "36rem",
      },
      margin: {
        17: "4.25rem",
        "20p": "20%",
      },
    },
  },
  plugins: [],
};
