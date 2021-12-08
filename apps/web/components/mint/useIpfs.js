import * as IPFS from 'ipfs-core'
// ipfs is the core API, a CLI and a HTTP server that functions as a HTTP to IPFS bridge
// and an RPC endpoint. See https://www.npmjs.com/package/ipfs
import { useEffect, useState } from "react";

let ipfs = null;


export default function useIpfs() {

  useEffect(() => {
  
    return function cleanup() {
      if (ipfs && ipfs.stop) {
        console.log("Stopping IPFS");
        ipfs.stop().catch((err) => console.error(err));
        ipfs = null;
      }
    };
  }, []);

  async function init() {
    // initialise IPFS daemon
    if (ipfs) {
      console.log("IPFS already started");
    } else {
      try {
        console.time("IPFS Started"); // start timer
        ipfs = await IPFS.create(options)
        console.timeEnd("IPFS Started"); // stop timer and log duration in console
      } catch (error) {
        console.error("IPFS init error:", error);
        ipfs = null;
      }
    }
    return ipfs;
  }

  return init;
}
const options = {
    "API": {
       "HTTPHeaders": {
           "Access-Control-Allow-Origin": [
               "*"
           ],
           "Access-Control-Allow-Methods": [
               "GET",
               "POST"
           ],
           "Access-Control-Allow-Headers": [
               "Authorization"
           ],
           "Access-Control-Expose-Headers": [
               "Location"
           ],
           "Access-Control-Allow-Credentials": [
               "true"
           ]
       }
    }
   }