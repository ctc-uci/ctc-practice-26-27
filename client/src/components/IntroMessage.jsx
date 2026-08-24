import { useState } from "react";
import { Box, Button, Link, Text } from "@chakra-ui/react";

const IntroMessage = () => {
    const [clickedLink, setClickedLink] = useState(false);

    return (
        <Box
            marginY={4}
            gap={4}
        >
            <Text
                fontSize={"xx-large"}
                fontWeight={"semibold"}
                color={"purple"}
            >
                CTC NPO Project Info
            </Text>

            <Box
                display="flex"
                flexDirection={"column"}
                gap={2}
            >
                <Text as="p">
                    Your task here, as described in the project document, is to
                    fetch data from your backend and database, and to then
                    display it on this page. There is no need to style your work,
                    as our primary focus is on assessing the core
                    implementation. Use Chakra for your UI components and Axios
                    for data fetching.
                </Text>
                <Text
                    as="p"
                    display={"inline"}
                >
                    Here are some links that may be of use:{" "}
                    <Link
                        href="https://www.youtube.com/watch?v=exzQkvv7g1w"
                        target="_blank"
                        referrerPolicy="no-referrer"
                    >
                        <Button
                            variant={"link"}
                            onClick={() => setClickedLink(true)}
                        >
                            Chakra Docs&nbsp;
                            {clickedLink ? (
                                <Text
                                    fontWeight={"semibold"}
                                    fontStyle={"italic"}
                                    color={"purple"}
                                >
                                    (trolled lol)
                                </Text>
                            ) : null}
                        </Button>
                    </Link>
                </Text>
            </Box>
        </Box>
    );
};

export default IntroMessage;
