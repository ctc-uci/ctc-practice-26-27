import {
    Box,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from 'react'
import IntroMessage from "./components/IntroMessage";

const Backend = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
});

const App = () => {
    const [data, setData] = useState([{}])

    const getData = async () => {
        const data = await Backend.get(`/projects`);
        setData(data["data"])
    };

    useEffect(() => {
        getData();
    }, [])
    

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
                            <Th isNumeric>Start Year</Th>
                            <Th isNumeric>End Year</Th>
                            <Th>Project Leads </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map(proj => 
                            <Tr key={proj.id}>
                                <Td>{proj.name}</Td>
                                <Td>{proj.description}</Td>
                                <Td isNumeric>{proj.startYear}</Td>
                                <Td isNumeric>{proj.endYear}</Td>
                                <Td>{proj.projectLeads}</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default App;
