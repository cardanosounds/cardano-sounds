import { Flex, Image } from "@chakra-ui/react";
import Layout from "../components/layout";
import { Slide } from "react-slideshow-image";
import { createRef } from "react";
import "react-slideshow-image/dist/styles.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function LitepaperSlideshow() {
    const slideRef = createRef();
    const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: false,
        infinite: true,
        easing: "ease",
        indicators: (i) => <div className="indicator">{i + 1}</div>
    };
    // const slideImages = [
    //     "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    //     "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    //     "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    //     "https://images.unsplash.com/photo-1444525873963-75d329ef9e1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
    // ];
    const slideImages = [
        "/litepaper/CS-LP-S1-Story.png",
        "/litepaper/CS-LP-S2-Story.png",
        "/litepaper/CS-LP-S3-Story.png",
        "/litepaper/CS-LP-S4-Story.png",
        "/litepaper/CS-LP-S5-Story.png",
        "/litepaper/CS-LP-S6-Story.png",
        "/litepaper/CS-LP-S7-Story.png",
        "/litepaper/CS-LP-S9-Story.png",
        "/litepaper/CS-LP-S10-Story.png"
    ];
    const back = () => {
        (slideRef.current as any).goBack();
    }
    const next = () => {
        (slideRef.current as any).goNext();
    }
    return (
        <Layout>
            <Flex direction={'row'} m="auto" mt={["23vh", "23vh", "7%"]} align="center" w={["80vw","80vw", "60%"]} mx="auto" justify="center" minH="70vh" maxH="100vh">
                <div className="slide-container left buttons">
                    <button onClick={back} type="button">
                        <ChevronLeftIcon/>
                        {/* Go Back */}
                    </button>
                </div>
                <div className="slide-container">
                    <Slide ref={slideRef} {...properties}>
                        {slideImages.map((each, index) => (
                            <Flex width="80vw" height={["unset", "unset", "70vh"]} key={index} className="each-slide">
                                <Image className="lazy" src={each} alt="sample" />
                            </Flex>
                        ))}
                    </Slide>
                </div>

                <div className="slide-container right buttons">
                    <button onClick={next} type="button">
                        <ChevronRightIcon/>
                        {/* Go Next */}
                    </button>
                </div>
            </Flex>
        </Layout>
    );
}