import React from "react";
import { Box } from "@chakra-ui/react";
import utilStyles from "../styles/utils.module.css"
import { MouseEventHandler } from "react";

export default function Logo({ color, size, pos, top, right, display, onclick } : {
    color?: string | Array<string | null>
    size?: string | Array<string | null>
    pos?: "absolute" | "initial" | Array<"absolute" | "initial" | null>
    top?: string | Array<string | null>
    right?: string | Array<string | null>
    display?: "none" | "flex" | Array<"none" | "flex"| null>
    onclick?: Function
}) {
    { }
    if(typeof(color) === "undefined") {
        color = "#fff"
    }
    if(typeof(size) === "undefined") {
        size = "5em"
    }
    if(typeof(pos) === "undefined") {
        pos = "initial"
    }
    if(typeof(top) === "undefined") {
        top = "15vh"
    }
    if(typeof(right) === "undefined") {
        right = "20vw"
    }
    if(typeof(display) === "undefined") {
        display = "flex"
    }
  return (
    <Box
      as="svg"
      role="img"
      width={ size }
      height={ size }
      position={ pos }
      right={ right }
      top={ top }
      display={ display }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 590 555.8"
      fill={ color }
      transition="all 0.6s ease-in-out" 
      className={utilStyles.pointerOnHover}
      onClick= { onclick as MouseEventHandler<HTMLDivElement> & MouseEventHandler<SVGSVGElement> }
      //fill="#1f2127"
      //_hover={{
      //  fill: "brand.accent",
      // }}
    >
      <title>Cardano Sounds logo</title>
      <g>
      <circle cx="294.5" cy="536.3" r="17.5"/>
      <circle cx="156" cy="198.8" r="23"/>
      <circle cx="156.5" cy="360.3" r="22.5"/>
      <circle cx="192" cy="459.8" r="20"/>
      <circle cx="155" cy="523.8" r="13"/>
      <circle cx="73.5" cy="408.3" r="16.5"/>
      <circle cx="86" cy="278.8" r="20"/>
      <circle cx="12" cy="278.8" r="12"/>
      <circle cx="72.5" cy="151.3" r="16.5"/>
      <circle cx="191" cy="98.8" r="20"/>
      <circle cx="153.5" cy="34.3" r="12.5"/>
      <circle cx="294.5" cy="120.3" r="22.5"/>
      <circle cx="294.5" cy="22.3" r="17.5"/>
      <circle cx="434" cy="359.8" r="23"/>
      <circle cx="433.5" cy="198.3" r="22.5"/>
      <circle cx="398" cy="98.8" r="20"/>
      <circle cx="435" cy="34.8" r="13"/>
      <circle cx="516.5" cy="150.3" r="16.5"/>
      <circle cx="504" cy="278.8" r="20"/>
      <circle cx="578" cy="278.8" r="12"/>
      <circle cx="517.5" cy="407.3" r="16.5"/>
      <circle cx="399" cy="459.8" r="20"/>
      <circle cx="436.5" cy="524.3" r="12.5"/>
      <circle cx="294.5" cy="438.3" r="22.5"/>
      </g>
      <path d="M423.8,283.8c-0.1,0-5.1,18.6-8.6,2.2c-0.3-1.5-3.3-15.7-6.6-20.9c-0.4-0.6-1.6-2.4-3.4-2.4c-4.3,0-9.3,18.9-9.3,18.9
      s-1.9,9-3.4,11.2c-5.2,7.2-8.7-47-22.3-61.1c-1-1.3-2.4-2.2-4-2.5c-4.1-0.7-8.7,7-12.8,19.7c-7.8,24.7-13.9,38.9-15.2,41.4
      c-12.7,24.4-20.3-98.9-43.5-99.6v0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0v0c-23.2,0.7-30.8,124-43.5,99.6c-1.3-2.5-7.4-16.7-15.2-41.4
      c-4.1-12.7-8.7-20.4-12.8-19.7c-1.6,0.4-3,1.3-4,2.5c-13.6,14.1-17.1,68.3-22.3,61.1c-1.5-2.1-3.4-11.2-3.4-11.2s-5.1-18.9-9.3-18.9
      c-1.8,0-3,1.8-3.4,2.4c-3.2,5.2-6.3,19.4-6.6,20.9c-3.6,16.3-8.5-2.2-8.6-2.2c-0.1,0,0.2,1.2,1.4,6.1c0.7,3.4,2.1,6.7,4.1,9.6
      c0.2,0.3,1.2,1.7,1.8,1.8c0.5-0.1,1-0.4,1.3-0.7c2.1-2,4-12.3,4.1-13.1c2.4-12.5,6.1-7.5,7.3-0.1h0.1c1.4,7.4,10.3,38.7,16.6,38.5
      c6.3-0.1,15.1-35.8,15.1-35.8s3-14,6.9-7.7c3.9,6.3,14.5,54.5,26.1,71.7c17.6,26.5,32.6-76.1,44.5-76.1s27,102.6,44.5,76.1
      c11.6-17.2,22.2-65.4,26.1-71.7c3.9-6.3,6.9,7.7,6.9,7.7s8.8,35.7,15.1,35.8c6.3,0.1,15.2-31.1,16.6-38.5h0.1
      c1.2-7.4,4.9-12.4,7.3,0.1c0.1,0.8,1.9,11.1,4.1,13.1c0.4,0.4,0.8,0.6,1.3,0.7c0.6-0.1,1.6-1.5,1.8-1.8c2-2.9,3.3-6.2,4.1-9.6
      C423.6,285,423.9,283.8,423.8,283.8z"/>
  </Box>
  );
}
