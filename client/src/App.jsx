import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
} from "@chakra-ui/react";
import axios from "axios";

import IntroMessage from "./components/IntroMessage";

const Backend = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
});

const wrapCell = { whiteSpace: "normal", wordBreak: "break-word" };
const editableStyle = {
    bg: "purple.50",
    borderBottom: "1px dashed",
    borderColor: "purple.400",
    px: 1,
    borderRadius: "sm",
};

const App = () => {
    const [projects, setProjects] = useState([]);
    const [edits, setEdits] = useState({});
    const [savedId, setSavedId] = useState(null);

    const getData = async () => {
        const { data } = await Backend.get(`/`);
        setProjects(data);
    };

    useEffect(() => {
        getData();
    }, []);

    const setField = (id, field, value) => {
        setEdits({ ...edits, [id]: { ...edits[id], [field]: value } });
    };

    const handleSave = async (project) => {
        const edit = edits[project.id] ?? {};
        await Backend.put(`/${project.id}`, {
            npoId: project.npoId,
            startYear: Number(edit.startYear ?? project.startYear),
            endYear: Number(edit.endYear ?? project.endYear),
            projectLeads: (
                edit.projectLeads ?? project.projectLeads.join(", ")
            )
                .split(",")
                .map((lead) => lead.trim()),
        });
        await getData();

        setSavedId(project.id);
        setTimeout(() => setSavedId(null), 1500);
    };

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            maxWidth={1400}
            marginX={"auto"}
        >
            <IntroMessage />

            <TableContainer overflowX="visible">
                <Table
                    variant="simple"
                    sx={{ tableLayout: "fixed", width: "100%" }}
                >
                    <TableCaption>
                        NPO Project Info (✎ = editable column)
                    </TableCaption>
                    <Thead>
                        <Tr>
                            <Th width="15%">Name</Th>
                            <Th width="35%">Description</Th>
                            <Th isNumeric width="10%">
                                ✎ Start Year
                            </Th>
                            <Th isNumeric width="10%">
                                ✎ End Year
                            </Th>
                            <Th width="25%">✎ Project Leads</Th>
                            <Th width="80px"></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {projects.map((project) => (
                            <Tr key={project.id}>
                                <Td sx={wrapCell}>{project.name}</Td>
                                <Td sx={wrapCell}>{project.description}</Td>
                                <Td sx={{ ...wrapCell, textAlign: "center" }}>
                                    <Editable
                                        defaultValue={String(
                                            project.startYear
                                        )}
                                        onChange={(value) =>
                                            setField(
                                                project.id,
                                                "startYear",
                                                value
                                            )
                                        }
                                    >
                                        <EditablePreview sx={editableStyle} />
                                        <EditableInput />
                                    </Editable>
                                </Td>
                                <Td sx={{ ...wrapCell, textAlign: "center" }}>
                                    <Editable
                                        defaultValue={String(project.endYear)}
                                        onChange={(value) =>
                                            setField(
                                                project.id,
                                                "endYear",
                                                value
                                            )
                                        }
                                    >
                                        <EditablePreview sx={editableStyle} />
                                        <EditableInput />
                                    </Editable>
                                </Td>
                                <Td sx={wrapCell}>
                                    <Editable
                                        defaultValue={project.projectLeads.join(
                                            ", "
                                        )}
                                        onChange={(value) =>
                                            setField(
                                                project.id,
                                                "projectLeads",
                                                value
                                            )
                                        }
                                    >
                                        <EditablePreview sx={editableStyle} />
                                        <EditableInput />
                                    </Editable>
                                </Td>
                                <Td>
                                    <Tooltip
                                        label="Saved!"
                                        isOpen={savedId === project.id}
                                        placement="top"
                                        hasArrow
                                    >
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleSave(project)
                                            }
                                        >Save</Button>
                                    </Tooltip>
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
