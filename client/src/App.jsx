import { useEffect, useState } from "react";
import {
    Box,
    Button,
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

import IntroMessage from "./components/IntroMessage";

const Backend = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
});

const App = () => {
    const [projects, setProjects] = useState([]);

    const getData = async () => {
        const { data } = await Backend.get(`/`);
        setProjects(data);
    };

    useEffect(() => {
        getData();
    }, []);

    const handleEdit = async (project) => {
        const startYear = prompt("Start Year", project.startYear);
        const endYear = prompt("End Year", project.endYear);
        const projectLeads = prompt(
            "Project Leads (comma separated)",
            project.projectLeads.join(", ")
        );
        if (startYear === null || endYear === null || projectLeads === null)
            return;

        await Backend.put(`/${project.id}`, {
            npoId: project.npoId,
            startYear: Number(startYear),
            endYear: Number(endYear),
            projectLeads: projectLeads.split(",").map((s) => s.trim()),
        });
        getData();
    };

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
                    <TableCaption>NPO Project Info</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Description</Th>
                            <Th isNumeric>Start Year</Th>
                            <Th isNumeric>End Year</Th>
                            <Th>Project Leads</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {projects.map((project) => (
                            <Tr key={project.id}>
                                <Td>{project.name}</Td>
                                <Td>{project.description}</Td>
                                <Td isNumeric>{project.startYear}</Td>
                                <Td isNumeric>{project.endYear}</Td>
                                <Td>{project.projectLeads.join(", ")}</Td>
                                <Td>
                                    <Button
                                        size="sm"
                                        onClick={() => handleEdit(project)}
                                    >
                                        Edit
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default App;
