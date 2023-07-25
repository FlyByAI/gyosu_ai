import PolicyPage from "../components/PolicyPage";
import { termsOfUse } from "../constants/policyData";

export default function Terms() {

    return (
        <PolicyPage title={termsOfUse.title} content={termsOfUse.content} />
    )
}