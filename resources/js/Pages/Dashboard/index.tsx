import { ReactNode } from 'react';
import MainLayout from '../Layouts/MainLayout';

function Index() {
  return <b>asda</b>;
}

// Assign layout to the page
Index.layout = (page: ReactNode) => <MainLayout>{page}</MainLayout>;

export default Index;
