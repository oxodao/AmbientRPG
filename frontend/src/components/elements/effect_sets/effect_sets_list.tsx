import ElementList from "../element_list";
import AmbientAccordion from "../ambient_accordion";
import { useAppProps } from "../../../context";
import { IconSparkles } from "@tabler/icons-react";

type Props = {
    title: string;
};

export default function EffectSetsList({ title }: Props) {
    const { sdk, campaign } = useAppProps();

    if (!campaign) {
        return;
    }

    return <>
        <AmbientAccordion title={title}>
            <ElementList
                emptyText={"Aucune séquence d'effets"}
                fetchElements={async (query: string) => {
                    const data = await sdk.effectSets.getCollection(
                        query,
                        campaign,
                    );

                    if (!data) {
                        return [];
                    }

                    return data.items || [];
                }}
                onClick={async x => await sdk.state.triggerFx(x.iri)}
                icon={() => <IconSparkles size={18} />}
            />
        </AmbientAccordion>
    </>
}