import Card from "../components/Card";
import { useAITools } from "../hooks/tools/useAITools";
import { ITool } from "../interfaces";

export default function Posts() {

    const tools = useAITools();

    return (
        <>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((item: ITool, index) => (
                    <Card
                        key={index}
                        title={item.title || ""}
                        description={item.description || ""}
                        imageUrl={item.imageUrl || ""}
                        linkUrl={item.linkUrl || ""}
                    />
                ))}
            </div>
        </>
    );
}