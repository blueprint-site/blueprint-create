import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/loading-overlays/LoadingSpinner";
import SchematicSearchCard from "@/components/features/schematics/SchematicSearchCard";
import SchematicCard from "@/components/features/schematics/SchematicCard";
import { useSearchSchematics } from "@/api";
import { buttonVariants } from "@/components/ui/button.tsx";
import { Upload } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
} from "@/components/ui/select";

function SchematicsListWithFilters() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page] = useState(1);
    const [category, setCategory] = useState("all");
    const [version, setVersion] = useState("all");
    const [loaders, setLoaders] = useState("all");
    const navigate = useNavigate();

    const { data: schematics, isLoading, isError } = useSearchSchematics(
        searchQuery,
        page,
        category,
        version,
        loaders
    );
    console.log(schematics);

    const handleInputChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    return (
        <>
            <div className="float-end ">
                <Link
                    className={buttonVariants({ variant: "default" })}
                    to="../schematics/upload"
                >
                    <Upload /> Upload Schematic
                </Link>
            </div>

            <div className="container mx-auto flex gap-6">
                {/* Sidebar */}
                <aside className="w-1/4 p-4 bg-surface-1 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>
                    <SchematicSearchCard
                        searchQuery={searchQuery}
                        onSearchChange={handleInputChange}
                    />

                    {/* Category Filter */}
                    <label className="block mb-2">Category</label>
                    <Select
                        value={category}
                        onValueChange={(value) => setCategory(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="castle">Castle</SelectItem>
                                <SelectItem value="farm">Farm</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Version Filter */}
                    <label className="block mt-4 mb-2">Version</label>
                    <Select value={version} onValueChange={(value) => setVersion(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Version" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="1.20">1.20</SelectItem>
                                <SelectItem value="1.19">1.19</SelectItem>
                                <SelectItem value="1.18">1.18</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Loaders Filter */}
                    <label className="block mt-4 mb-2">Loaders</label>
                    <Select value={loaders} onValueChange={(value) => setLoaders(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Loader" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="forge">Forge</SelectItem>
                                <SelectItem value="fabric">Fabric</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex justify-center mt-8">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : isError ? (
                        <div className="text-center text-destructive font-semibold">
                            Oops! Failed to load schematics.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                            {schematics && schematics.length > 0 ? (
                                schematics.map((schematic) => (
                                    <SchematicCard
                                        key={schematic.id}
                                        schematic={schematic}
                                        onClick={() => navigate(`../schematics/${schematic.id}`)}
                                    />
                                ))
                            ) : (
                                <h3 className="text-center col-span-full text-lg font-semibold">
                                    No schematics found.
                                </h3>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default SchematicsListWithFilters;
