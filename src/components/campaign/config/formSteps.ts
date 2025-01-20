import BasicInfo from "../steps/BasicInfo";
import Requirements from "../steps/Requirements";
import Compensation from "../steps/Compensation";
import ImageUpload from "../ImageUpload";

export const steps = [
  {
    title: "Basic Information",
    description: "Let's start with the core details",
    component: BasicInfo,
  },
  {
    title: "Requirements",
    description: "Define what you're looking for",
    component: Requirements,
  },
  {
    title: "Compensation",
    description: "Set your budget and perks",
    component: Compensation,
  },
  {
    title: "Campaign Image",
    description: "Add a visual to your campaign",
    component: ImageUpload,
  },
];