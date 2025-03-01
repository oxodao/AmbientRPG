import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { IconChevronCompactDown } from "@tabler/icons-react";
import { ReactNode } from "react";

export default function AmbientAccordion({ title, children }: { title: string, children: ReactNode }) {
    return <Accordion>
        <AccordionSummary expandIcon={<IconChevronCompactDown size={18} />}>
            <Typography component="span">{title}</Typography>
        </AccordionSummary>

        <AccordionDetails>
            {children}
        </AccordionDetails>
    </Accordion>
}