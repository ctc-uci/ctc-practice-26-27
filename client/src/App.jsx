import {
    Box,
    Input,
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
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const getData = async () => {
            const res = await Backend.get(`/projects`);
            setData(res.data);
        };

        getData();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            Backend.get(`/projects`).then((res) => setData(res.data));
            return;
        }
        Backend.get(`/projects/search`, { params: { lead: searchTerm } }).then(
            (res) => setData(res.data)
        );
    });

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.checked);
    };

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            maxWidth={1400}
            marginX={"auto"}
        >
            <IntroMessage />

            <Box maxWidth={320} marginBottom={4}>
                <Input
                    placeholder="Search by project lead"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </Box>

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
