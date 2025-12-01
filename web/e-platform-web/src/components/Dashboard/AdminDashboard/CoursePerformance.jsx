import { CoursePerformanceList } from '../../shared/CourseProgressCard';

export default function CoursePerformance({ data = [], isLoading }) {

  return <CoursePerformanceList courses={data} isLoading={isLoading} variant="list" />;
}