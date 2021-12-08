import { Box, Image, Text } from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

function ImageDrop({ onLoadedRaw, ...props }) {
  const [image, setImage] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const imageObject = URL.createObjectURL(file);
        setImage(imageObject);
        imageToRaw(imageObject);
      });
    },
  });

  const imageToRaw = async (imageObject) => {
    const blob = await fetch(imageObject).then((r) => r.blob());
    const arrayBuffer = await blob.arrayBuffer();
    onLoadedRaw(arrayBuffer);
  };

  useEffect(() => {
    return () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <Box
      {...props}
      width="80%"
      height="180px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {image ? (
        <Box position="relative" height="full">
          <SmallCloseIcon
            position="absolute"
            right="-6"
            top="-4"
            cursor="pointer"
            onClick={() => setImage(null)}
          />
          <Image height="full" src={image} />
        </Box>
      ) : (
        <Box
          border="2px dotted teal"
          rounded="md"
          background="gray.200"
          padding="8"
          opacity="0.6"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="full"
          height="full"
        >
          <div
            {...getRootProps({ className: "dropzone" })}
            style={{ width: "100%", height: "100%" }}
          >
            <input {...getInputProps()} />
            <p>
              <Text fontSize="40">+</Text>
              <Text>Drop image here or click</Text>
            </p>
          </div>
        </Box>
      )}
    </Box>
  );
}

export default ImageDrop;
