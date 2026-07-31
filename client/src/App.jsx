import {
    Box,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

import IntroMessage from "./components/IntroMessage";

const Backend = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
});

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const res = await Backend.get(`/projects`);
            setData(res.data);
        };

        getData();
    }, []);

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            maxWidth={1400}
            marginX={"auto"}
        >
            <IntroMessage />

            <TableContainer>
                <Table variant="simple">
                    <TableCaption>
                        CTC NPO Information
                    </TableCaption>
                    <Thead>
                        <Tr>
                            <Th>NPO Name</Th>
                            <Th>NPO Description</Th>
                            <Th>Start Year</Th>
                            <Th>End Year</Th>
                            <Th>Project Leads</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            data?.map((project) => (
                                <Tr key={project.npoId}>
                                    <Td>{project.npoName}</Td>
                                    <Td>{project.npoDescription}</Td>
                                    <Td>{project.startYear}</Td>
                                    <Td>{project.endYear}</Td>
                                    <Td>{project.projectLeads.join(", ")}</Td>
                                </Tr>
                            ))
                        }
                        
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default App;
