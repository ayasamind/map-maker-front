import Layout from "@/components/layouts/Layout";
import { DndList, DndListProps } from "@/components/DndList";  // Importing DndList component from the correct file path

const SearchTest = () => {
  const data = [
  {
    position: 1,
    mass: 1.008,
    symbol: 'H',
    name: 'Hydrogen',
  },
  {
    position: 2,
    mass: 4.003,
    symbol: 'He',
    name: 'Helium',
  },
  {
    position: 3,
    mass: 6.941,
    symbol: 'Li',
    name: 'Lithium',
  },
];

  return <Layout title="Searchテスト">
      <DndList data={data} />
  </Layout>;
};

export default SearchTest;
