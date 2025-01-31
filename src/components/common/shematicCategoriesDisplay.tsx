import { useAppStore } from "@/stores/useAppStore.ts";

const SchematicCategoriesDisplay = ({ categoriesList = [] }: { categoriesList: string[] }) => {
    const { categories } = useAppStore();
    console.log("Categories from store:", categories);

    if (categoriesList.length === 0) {
        return <div>No categories found!</div>;
    }

    const categoryName = (catId: number) => {
        return categories[String(catId)] || "Unknown Category";
    };

    return (
        <div className='flex flex-row gap-2'>
            {categoriesList.map((categoryId, i) => (
                <div key={i}>{categoryName(parseInt(categoryId))}</div>
            ))}
        </div>
    );
};

export default SchematicCategoriesDisplay;
