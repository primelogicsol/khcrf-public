import { FaUsers, FaFileAlt, FaHandshake, FaSearch, FaRegFileAlt, FaClipboardCheck, FaUserGraduate, FaBookOpen } from 'react-icons/fa';

export const assessmentPipeline = [
  { num: 1, title: "Public Participation", icon: FaUsers },
  { num: 2, title: "Evidence Collection", icon: FaFileAlt },
  { num: 3, title: "Stakeholder Consultation", icon: FaHandshake },
  { num: 4, title: "Evidence Review", icon: FaSearch },
  { num: 5, title: "Draft Findings", icon: FaRegFileAlt },
  { num: 6, title: "Public Validation", icon: FaClipboardCheck },
  { num: 7, title: "Expert Review", icon: FaUserGraduate },
  { num: 8, title: "Final Report", icon: FaBookOpen },
];

export const currentAssessmentStage = 2; // "Evidence Collection" is Active, based on ConsultationTrackerClient having "In Progress"
