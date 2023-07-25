import PolicyPage from "../components/PolicyPage";
import { privacyPolicy } from "../constants/policyData";

export default function PrivacyPolicy() {

    return (
        <PolicyPage title={privacyPolicy.title} content={privacyPolicy.content} />
    )
}


