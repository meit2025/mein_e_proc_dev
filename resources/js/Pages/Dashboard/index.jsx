import MainLayout from '../Layouts/MainLayout';

function Index({ title }) {
  return <b>asda</b>;
}

// Assign layout to the page
Index.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Index;
