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
import { useEffect, useState } from "react";
import axios from "axios";

import IntroMessage from "./components/IntroMessage";

const Backend = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
});

const App = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const { data } = await Backend.get("/projects");
                setProjects(data);
            } catch (err) {
                console.error(err);
            }
        };
        getData();
    }, []);


    return (
        <Box>
            <IntroMessage />

            <TableContainer>
                <Table variant="simple">
                    <TableCaption>CTC 67</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Description</Th>
                            <Th >Start Year</Th>
                            <Th >End Year</Th>
                            <Th>Project Leads</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {projects.map((project) => (
                            <Tr key={project.id}>
                                <Td>{project.name}</Td>
                                <Td >{project.description}</Td>
                                <Td isNumeric>{project.startYear}</Td>
                                <Td isNumeric>{project.endYear}</Td>
                                <Td>{project.projectLeads}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

        </Box>
    );
};

export default App;
