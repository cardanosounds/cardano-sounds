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
      onClick= { onclick as MouseEventHandler<HTMLDivElement> & MouseEventHandler<SVGSVGElement> }
      //fill="#1f2127"
      //_hover={{
      //  fill: "brand.accent",
      // }}
    >
  <title>Cardano Sounds logo</title>
  <g>
    <circle cx="294.5" cy="538.3" r="17.5"/>
    <circle cx="156" cy="200.8" r="23"/>
    <circle cx="156.5" cy="362.3" r="22.5"/>
    <circle cx="192" cy="461.8" r="20"/>
    <circle cx="155" cy="525.8" r="13"/>
    <circle cx="73.5" cy="410.3" r="16.5"/>
    <circle cx="86" cy="280.8" r="20"/>
    <circle cx="12" cy="280.8" r="12"/>
    <circle cx="72.5" cy="153.3" r="16.5"/>
    <circle cx="156" cy="200.8" r="23"/>
    <circle cx="191" cy="100.8" r="20"/>
    <circle cx="153.5" cy="36.3" r="12.5"/>
    <circle cx="294.5" cy="122.3" r="22.5"/>
    <circle cx="294.5" cy="24.3" r="17.5"/>
    <circle cx="434" cy="361.8" r="23"/>
    <circle cx="433.5" cy="200.3" r="22.5"/>
    <circle cx="398" cy="100.8" r="20"/>
    <circle cx="435" cy="36.8" r="13"/>
    <circle cx="516.5" cy="152.3" r="16.5"/>
    <circle cx="504" cy="280.8" r="20"/>
    <circle cx="578" cy="280.8" r="12"/>
    <circle cx="517.5" cy="409.3" r="16.5"/>
    <circle cx="434" cy="361.8" r="23"/>
    <circle cx="399" cy="461.8" r="20"/>
    <circle cx="436.5" cy="526.3" r="12.5"/>
    <circle cx="294.5" cy="440.3" r="22.5"/>
  </g>
  <g>
    <g>
      <path d="M294.4,193.8c23,0,30.5,122.3,43.1,98.2,1.3-2.5,7.3-16.5,15-40.8,4-12.5,8.6-20.1,12.6-19.4a7,7,0,0,1,3.9,2.5c13.4,13.9,16.9,67.3,22,60.2,1.5-2.1,3.4-11,3.4-11s5-18.6,9.2-18.6c1.8,0,3,1.8,3.4,2.4,3.2,5.1,6.2,19.1,6.5,20.6,3.5,16.1,8.4-2.2,8.5-2.2s-.2,1.2-1.4,6a27.2,27.2,0,0,1-4,9.5c-.2.3-1.2,1.7-1.8,1.8a2.7,2.7,0,0,1-1.3-.7c-2.1-2-3.9-12.1-4-12.9h0c-2.4-12.3-6-7.4-7.2-.1h-.1c-1.4,7.3-10.2,38.1-16.4,38S370.9,292,370.9,292s-3-13.8-6.8-7.6-14.3,53.7-25.7,70.7c-17.3,26.1-32.1-75-43.9-75"/>
      <rect className={utilStyles.a} x="-400" y="-252.4" width="1389" height="1080"/>
    </g>
    <g>
      <path d="M294.6,193.8c-23,0-30.5,122.3-43.1,98.2-1.3-2.5-7.3-16.5-15-40.8-4-12.5-8.6-20.1-12.6-19.4a7,7,0,0,0-3.9,2.5c-13.4,13.9-16.9,67.3-22,60.2-1.5-2.1-3.4-11-3.4-11s-5-18.6-9.2-18.6c-1.8,0-3,1.8-3.4,2.4-3.2,5.1-6.2,19.1-6.5,20.6-3.5,16.1-8.4-2.2-8.5-2.2s.2,1.2,1.4,6a27.2,27.2,0,0,0,4,9.5c.2.3,1.2,1.7,1.8,1.8a2.7,2.7,0,0,0,1.3-.7c2.1-2,3.9-12.1,4-12.9h0c2.4-12.3,6-7.4,7.2-.1h.1c1.4,7.3,10.2,38.1,16.4,38S218.1,292,218.1,292s3-13.8,6.8-7.6,14.3,53.7,25.7,70.7c17.3,26.1,32.1-75,43.9-75"/>
      <rect className={utilStyles.a} x="-400" y="-252.4" width="1389" height="1080"/>
    </g>
  </g>
    </Box>
  );
}
