export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: string;
  postedAt: string;
  slug?: string;
  jobCode?: string;
}
