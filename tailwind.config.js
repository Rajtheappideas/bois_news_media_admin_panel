/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#003F7A",
        textColor: "#717579",
        textBlack: "#1D1B23",
        buttonGray: "#507787",
        buttonRed: "#E20000",
        buttonGreen: "#00A651",
        blueGradientFrom: "#0893D3",
        blueGradientTo: "#1EB9D8",
        pinkGradientFrom: "#FE585B",
        pinkGradientTo: "#F6819B",
        goldGradientFrom: "#FF7C06",
        goldGradientTo: "#FFB31E",
        purpleGradientFrom: "#9C2D9D",
        purpleGradientTo: "#F3664B",
        darkBlueGradientFrom: "#397289",
        darkBlueGradientTo: "#6595A9",
        greenBlueGradientFrom: "#3EA956",
        greenBlueGradientTo: "#27D496",
      },
      screens: {
        "hover-hover": { raw: "(hover: hover)" },
      },
    },
  },
  plugins: [],
};
