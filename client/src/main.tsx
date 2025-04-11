import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Styles for custom fonts and Bible verse component
const styles = `
  body {
    font-family: 'Nunito', sans-serif;
    color: #333333;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
  }
  
  .bible-verse {
    position: relative;
    font-style: italic;
    padding-left: 1rem;
  }
  
  .bible-verse::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background-color: #f4b942;
  }
`;

// Add custom styles to the document
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

createRoot(document.getElementById("root")!).render(<App />);
