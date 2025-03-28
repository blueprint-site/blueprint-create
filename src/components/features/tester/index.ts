import TesterMain from '@/components/features/tester/TesterMain.tsx';
import BugReportMain from '@/components/features/tester/bug-report/BugReportMain.tsx';
import bugReportForm from '@/components/features/tester/bug-report/BugReportForm.tsx';

const Tester = {
  Main: () => TesterMain,
  Report: () => BugReportMain,
  Form: () => bugReportForm,
};

export default Tester;
